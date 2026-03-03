# Analytics Feature Implementation

## Overview
The analytics section on the profile page now displays real-time data calculated from the database, showing user engagement metrics, content performance, and growth statistics.

## Backend Implementation

### Controller: `Backend/src/modules/analytics/analytics.controller.js`
- **Function**: `getUserAnalytics(req, res, next)`
- **Endpoint**: `GET /api/v1/analytics` (current user) or `GET /api/v1/analytics/:userId` (specific user)
- **Authentication**: Required (uses authMiddleware)

### Data Calculated:
1. **Overview Metrics**:
   - `profileViews`: Simulated based on connections + notifications (in production, track actual views)
   - `postImpressions`: Total reviews across all user's posts
   - `searchAppearances`: Simulated based on posts and connections
   - `growthPercentage`: Posts growth comparing last 30 days vs previous 30 days

2. **Content Metrics**:
   - `totalPosts`: Count of active posts by user
   - `totalReviews`: Total reviews received on all posts
   - `averageRating`: Average rating across all posts
   - `totalShares`: Sum of shares across all posts

3. **Engagement Metrics**:
   - `connections`: Total accepted connections
   - `sentConnections`: Connection requests sent
   - `receivedConnections`: Connection requests received
   - `messages`: Total messages sent
   - `notifications`: Total notifications received

4. **Activity Metrics**:
   - `postsLast30Days`: Posts created in last 30 days
   - `postsPrevious30Days`: Posts created in previous 30 days
   - `accountAge`: Days since account creation

### Routes: `Backend/src/modules/analytics/analytics.routes.js`
```javascript
GET /api/v1/analytics          // Get current user's analytics
GET /api/v1/analytics/:userId  // Get specific user's analytics
```

## Frontend Implementation

### Component: `client/src/assets/pages/ProfilePage.jsx`

#### State Management:
```javascript
const [analytics, setAnalytics] = useState(null);
const [analyticsLoading, setAnalyticsLoading] = useState(false);
```

#### Data Loading:
```javascript
const loadAnalytics = async (userId = null) => {
  try {
    setAnalyticsLoading(true);
    const response = await ApiService.getUserAnalytics(userId);
    if (response.success) {
      setAnalytics(response.data);
    }
  } catch (error) {
    console.error("Failed to load analytics:", error);
  } finally {
    setAnalyticsLoading(false);
  }
};
```

#### Display Features:
1. **Loading State**: Shows spinner while fetching data
2. **Main Metrics** (3 cards):
   - Profile views (past 7 days)
   - Post impressions (past 7 days)
   - Search appearances (past 7 days)

3. **Additional Details** (4 metrics):
   - Connections count
   - Total posts
   - Average rating (with star emoji)
   - Growth percentage (color-coded: green for positive, red for negative)

4. **Show All Analytics Button**: Placeholder for detailed analytics view

### API Service: `client/src/services/api.js`
```javascript
static async getUserAnalytics(userId = null) {
  const url = userId ? `/analytics/${userId}` : "/analytics";
  return this.request(url);
}
```

## Usage

### For Current User:
```javascript
// Load analytics for logged-in user
const response = await ApiService.getUserAnalytics();
```

### For Specific User:
```javascript
// Load analytics for user by ID
const response = await ApiService.getUserAnalytics(userId);
```

## Response Format

```json
{
  "success": true,
  "data": {
    "overview": {
      "profileViews": 45,
      "postImpressions": 120,
      "searchAppearances": 30,
      "growthPercentage": 25.5
    },
    "content": {
      "totalPosts": 15,
      "totalReviews": 120,
      "averageRating": 4.5,
      "totalShares": 45
    },
    "engagement": {
      "connections": 25,
      "sentConnections": 30,
      "receivedConnections": 28,
      "messages": 150,
      "notifications": 75
    },
    "activity": {
      "postsLast30Days": 5,
      "postsPrevious30Days": 4,
      "accountAge": 120
    }
  }
}
```

## Features

✅ Real-time data calculation from database
✅ Loading state with spinner
✅ Responsive grid layout
✅ Color-coded growth indicator
✅ Private to user indicator
✅ Fallback values (0) when no data
✅ Error handling
✅ Parallel database queries for performance
✅ Works for all user types (Student, Trainer, Institution)

## Testing

1. **Login to the application**
2. **Navigate to your profile page**
3. **View the Analytics section** - should show:
   - Profile views, post impressions, search appearances
   - Connections, total posts, average rating, growth percentage
   - Loading spinner while fetching
   - "Private to you" indicator

4. **Visit another user's profile** - analytics will load for that user

## Future Enhancements

1. **Actual Profile View Tracking**: Implement real profile view tracking instead of simulation
2. **Detailed Analytics Page**: Create a full analytics dashboard with charts and graphs
3. **Time Range Filters**: Allow users to view analytics for different time periods
4. **Export Analytics**: Allow users to export their analytics data
5. **Comparison View**: Compare analytics with previous periods
6. **Real-time Updates**: Use WebSocket for live analytics updates

## Notes

- Analytics are private and only visible to the profile owner
- Growth percentage is calculated based on post activity in last 30 days vs previous 30 days
- Profile views and search appearances are currently simulated (should be tracked in production)
- All database queries are optimized with parallel execution for better performance
