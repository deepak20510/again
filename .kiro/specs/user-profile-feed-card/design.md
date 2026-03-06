# User Profile Feed Card - LinkedIn Style Design

## Overview
Transform the left sidebar profile card in the feed section to display real-time user data from the database instead of the static rating section, replicating LinkedIn's profile card style.

## Current Implementation
- Shows hardcoded profile name, role/headline
- Displays a "RATING" section with static 4.8★ for trainers
- Shows skills for trainers
- Shows profile viewers/students count for other user types

## Proposed Changes

### 1. Remove Rating Section
- Remove the "RATING 4.8★" display from the profile card
- This data is already shown on individual posts as badges

### 2. Add LinkedIn-Style Profile Summary

#### For All User Types:
- **Profile Picture** with online status indicator (existing)
- **Full Name** with verification badge (existing)
- **Headline** (existing - user.headline or role)
- **Location** with 📍 icon (existing)
- **Bio/Summary** - Short 2-3 line summary from user.bio
- **Current Position** - From latest experience record (if available)
- **Education** - From latest education record (if available)

#### Additional for Trainers:
- **Skills** (existing - keep this)
- **Experience Years** - From trainerProfile.experience
- **Verification Status** - Show verified badge if trainerProfile.verified

#### Additional for Students:
- **Current Education** - From education records
- **Interests/Skills** - From studentProfile

#### Additional for Institutions:
- **Institution Name** - From institutionProfile.name
- **Location** - From institutionProfile.location

## Database Fields to Use

### User Model:
- `firstName`, `lastName` - Full name
- `profilePicture` - Avatar
- `bio` - Short summary (2-3 lines)
- `headline` - Professional headline
- `location` - Geographic location
- `isVerified` - Verification badge

### TrainerProfile Model:
- `skills` - Array of skills
- `experience` - Years of experience
- `verified` - Trainer verification status
- `bio` - Additional bio if user.bio is empty

### StudentProfile Model:
- `bio` - Student bio
- `location` - Student location

### InstitutionProfile Model:
- `name` - Institution name
- `location` - Institution location

### Education Model (Latest Record):
- `institution` - School/University name
- `degree` - Degree type
- `fieldOfStudy` - Major/Field
- `isCurrent` - Currently studying

### Experience Model (Latest Record):
- `title` - Job title
- `company` - Company name
- `isCurrent` - Currently working

## UI Layout (LinkedIn Style)

```
┌─────────────────────────────────┐
│   [Profile Picture with badge]  │
│                                  │
│   Deepak Mahato ✓               │
│   Pursuing Computer Science...   │
│                                  │
│   📍 Jharkhand                   │
│                                  │
│   🎓 National Institute of      │
│      Science and Technology...   │
│                                  │
│   ─────────────────────────     │
│                                  │
│   Skills (for trainers)          │
│   [React] [Node.js] [Python]    │
│                                  │
│   OR                             │
│                                  │
│   Profile viewers: 120           │
│   (for students)                 │
└─────────────────────────────────┘
```

## API Changes Needed

### New Endpoint (Optional):
`GET /api/users/me/profile-summary`

Returns:
```json
{
  "user": {
    "firstName": "Deepak",
    "lastName": "Mahato",
    "profilePicture": "url",
    "bio": "Short bio...",
    "headline": "Pursuing Computer Science...",
    "location": "Jharkhand",
    "isVerified": true
  },
  "currentEducation": {
    "institution": "National Institute of Science and Technology (NIST)",
    "degree": "Bachelor's",
    "fieldOfStudy": "Computer Science and Engineering",
    "location": "Berhampur"
  },
  "currentExperience": {
    "title": "Software Engineer",
    "company": "Tech Corp"
  },
  "trainerProfile": {
    "skills": ["React", "Node.js"],
    "experience": 5,
    "verified": true
  }
}
```

### Alternative: Extend Existing Auth Context
Add profile summary data to the existing user context that's already being fetched.

## Implementation Steps

1. **Backend**: Create/update API endpoint to fetch complete profile data
2. **Frontend**: Update LeftSidebar component to:
   - Remove rating section
   - Add bio/summary section
   - Add current education/experience
   - Fetch real-time data from API
3. **Styling**: Match LinkedIn's clean, professional card design
4. **Responsive**: Ensure mobile-friendly layout

## Benefits
- More informative profile card
- Better user engagement
- LinkedIn-familiar UX
- Real-time data display
- Professional appearance
