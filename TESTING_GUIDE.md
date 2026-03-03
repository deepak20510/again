# Testing Guide - Real-time Messaging & Notifications

## Quick Start

1. **Start Backend**
   ```bash
   cd Backend
   npm start
   ```

2. **Start Frontend**
   ```bash
   cd client
   npm run dev
   ```

3. **Open Multiple Browser Windows**
   - Window 1: Login as a Trainer
   - Window 2: Login as an Institution

## Test Real-time Messaging

### Test 1: Start a Conversation
1. In Window 1 (Trainer), click the messaging icon in navbar
2. Click "All Users" tab
3. You should see all institutions listed
4. Click on an institution to start a conversation
5. Chat window should open next to the messaging panel

### Test 2: Send Messages
1. Type a message in the chat window
2. Click send or press Enter
3. Message should appear instantly in your chat
4. In Window 2 (Institution), click messaging icon
5. You should see the conversation with the new message
6. Click the conversation to open chat window
7. The message from Window 1 should be visible

### Test 3: Real-time Message Delivery
1. Keep both chat windows open
2. Send a message from Window 1
3. **Without refreshing**, the message should appear in Window 2 instantly
4. Send a message from Window 2
5. **Without refreshing**, the message should appear in Window 1 instantly
6. Verify auto-scroll to bottom happens automatically

### Test 4: Conversation List Updates
1. Close chat windows but keep messaging panels open
2. Send a message from Window 1
3. In Window 2, the conversation list should update with the latest message
4. The conversation should move to the top of the list
5. Unread count badge should appear

## Test Real-time Notifications

### Test 1: Notification Bell Location
1. Look at the navbar
2. Notification bell should be positioned BEFORE the messaging icon
3. Should have a clean, professional look

### Test 2: Receive Notifications
1. In Window 1, send a message to Window 2
2. In Window 2, look at the notification bell
3. A red badge with count should appear (with pulse animation)
4. The notification dropdown should auto-show for 3 seconds
5. You should see "New Message" notification

### Test 3: Notification Interactions
1. Click the notification bell to open dropdown
2. Dropdown should slide down smoothly
3. Click a notification:
   - Should navigate to the message
   - Should mark as read (blue dot disappears)
   - Unread count should decrease
4. Click "Mark all read":
   - All notifications should be marked as read
   - Unread count should become 0

### Test 4: Notification Dropdown
1. Click notification bell to open
2. Click outside the dropdown
3. Dropdown should close
4. Click bell again to reopen
5. Verify smooth animations

## Test Socket Connection

### Test 1: Connection Status
1. Open browser console (F12)
2. Look for "Socket connected" message
3. Should appear when you login
4. No error messages should appear

### Test 2: Multiple Tabs
1. Open the app in 3 different tabs
2. Login to the same account in all tabs
3. All should connect successfully
4. Send a message from one tab
5. All tabs should receive the update

### Test 3: Reconnection
1. Stop the backend server
2. Check console - should see "Socket disconnected"
3. Start the backend server again
4. Socket should reconnect automatically
5. Test sending messages - should work

## Test Institution Names

### Test 1: Conversation List
1. Login as a Trainer
2. Open messaging panel
3. Start a conversation with an institution
4. The institution's NAME should display (not "undefined undefined")
5. Verify in conversation list

### Test 2: Chat Window
1. Open a chat with an institution
2. The header should show the institution's name
3. Not "undefined undefined" or blank

### Test 3: Available Users
1. Click "All Users" tab
2. Institutions should show their institution name
3. Trainers should show their first name + last name

## Common Issues & Solutions

### Issue: "Socket not connected"
**Solution:** 
- Check backend is running
- Check VITE_API_URL in .env
- Check browser console for errors
- Verify token is valid

### Issue: Messages not appearing in real-time
**Solution:**
- Check socket connection status in console
- Verify both users are in the same conversation
- Check backend logs for errors
- Try refreshing both windows

### Issue: Notifications not showing
**Solution:**
- Check socket connection
- Verify notification routes are working (check Network tab)
- Check backend is creating notifications
- Verify notification bell is visible in navbar

### Issue: Institution names showing as "undefined"
**Solution:**
- Backend changes should fix this
- If still broken, check backend logs
- Verify institutionProfile is included in queries

## Success Criteria

✅ Messages appear instantly without refresh
✅ Notification bell shows unread count
✅ Notifications auto-show for 3 seconds
✅ Dropdown has smooth animations
✅ Institution names display correctly
✅ Socket connects automatically on login
✅ Multiple tabs work simultaneously
✅ No console errors
✅ Auto-scroll works in chat
✅ Mark as read works correctly

## Performance Checks

1. **Memory Usage**
   - Open Task Manager / Activity Monitor
   - Monitor memory usage over 5 minutes
   - Should remain stable (no memory leaks)

2. **Network Traffic**
   - Open Network tab in DevTools
   - Should see WebSocket connection
   - Should NOT see constant polling
   - Messages should use WebSocket, not HTTP

3. **CPU Usage**
   - Should remain low during idle
   - Brief spike when sending/receiving messages is normal

## Browser Compatibility

Test in:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (if on Mac)

All features should work identically across browsers.
