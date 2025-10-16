# ADM-04: System-wide Bulletin - Admin Activity Notifications

## Overview

The Admin Activity Notification system tracks and displays all administrative actions in real-time through a notification bell interface. This provides transparency, audit trails, and quick access to recent admin activities.

## Features Implemented

### 1. Activity Logging System

Automatically tracks admin actions including:

- **Exports**: Data/report exports
- **Creates**: New users, properties, transactions
- **Updates**: Property edits, deal approvals
- **Deletes**: Record deletions
- **Approvals**: Deal/transaction approvals
- **Rejections**: Deal/transaction rejections
- **Logins**: Admin authentication events
- **Other**: Miscellaneous administrative actions

### 2. Notification Bell Component

**Location**: Admin header (top-right corner)

**Visual Features**:

- Bell icon with badge showing unread count
- Red badge displays: 1, 2, 3... 99, 99+
- Badge only appears when there are unread activities
- Badge clears when popover is opened

**Popover Interface**:

- **Header**: Shows "Admin Activity Log" with today/week stats
- **Tabs**: Filter by activity type (All, Export, Create, Update)
- **Scrollable List**: Last 50 activities
- **Auto-scroll**: 400px height with overflow

### 3. Activity Display

Each activity shows:

- **Icon**: Color-coded by action type
- **Description**: Human-readable action description
- **Admin Name**: Who performed the action
- **Timestamp**: "2 minutes ago", "5 hours ago", etc.
- **Metadata Badge**: Report type, property name, etc.
- **Highlight**: Unread activities have blue background

**Color Coding**:

- 🟢 Export/Approve: Green
- 🔵 Create: Blue
- 🟠 Update: Orange
- 🔴 Delete/Reject: Red
- 🟣 Login: Purple
- ⚫ Other: Gray

### 4. Activity Filtering

**Tab Options**:

- **All**: Shows all activities (default)
- **Export** (Download icon): Export-only activities
- **Create** (UserPlus icon): Creation activities
- **Update** (Edit icon): Update/modification activities

### 5. Persistence & State

- **localStorage**: Remembers last checked timestamp
- **Auto-refresh**: Updates in real-time with Convex
- **Unread Tracking**: Counts activities since last check
- **Cross-session**: Persists across browser sessions

## Technical Implementation

### Backend (Convex)

#### Schema (`convex/schema.ts`)

```typescript
admin_activity_logs: defineTable({
  adminId: v.id("users"),
  action: v.string(),
  actionType: v.union(...),
  targetType: v.optional(v.string()),
  targetId: v.optional(v.string()),
  description: v.string(),
  metadata: v.optional(v.object({...})),
  timestamp: v.number(),
  ipAddress: v.optional(v.string()),
})
.index("by_adminId", ["adminId"])
.index("by_timestamp", ["timestamp"])
.index("by_actionType", ["actionType"])
```

#### Functions (`convex/admin_activity.ts`)

- `logActivity`: Mutation to create activity log
- `getRecentActivities`: Query last N activities
- `getUnreadActivityCount`: Count unread since timestamp
- `getActivitiesByType`: Filter by action type
- `getActivityStats`: Overall statistics

### Frontend

#### Component (`admin-notification-bell.tsx`)

- **Dependencies**:
  - `date-fns` for time formatting
  - Radix UI for popover/tabs
  - Convex for real-time data
- **State Management**:
  - `lastChecked`: Timestamp of last notification check
  - `isOpen`: Popover open/close state
- **Auto-logging**: Integrated with export functions

#### Integration Points

- **Admin Header**: Notification bell added to header
- **Data Export**: All exports auto-log activities
- **Future**: Can be added to any admin action

## Usage

### For Admins

1. **View Notifications**:

   - Click bell icon in admin header
   - Popover shows recent activities
   - Badge clears automatically

2. **Filter Activities**:

   - Click tab icons to filter by type
   - "All" tab shows everything
   - Each tab shows relevant count

3. **Track Activity**:

   - Recent activities appear at top
   - Unread items highlighted in blue
   - Timestamp shows relative time

4. **Monitor Stats**:
   - Header shows: "Today: X" and "Week: Y"
   - Quick overview of activity volume

### Auto-Logged Actions

**Currently Implemented**:

- Export Properties Report
- Export Transactions Report
- Export Users Report
- Export Hotspot Analysis
- Export Regional Market Report
- Export Complete Package

**Example Log Entries**:

```
"Exported Properties report (45 records)"
"Exported complete report package (5 sheets, 150 total records)"
```

## Activity Log Examples

### Export Activity

```typescript
{
  action: "exported_properties",
  actionType: "export",
  description: "Exported Properties report (45 records)",
  targetType: "report",
  metadata: {
    reportType: "Properties"
  }
}
```

### Create Activity (Future)

```typescript
{
  action: "created_user",
  actionType: "create",
  description: "Created new seller account for John Doe",
  targetType: "user",
  targetId: "user_id_123",
  metadata: {
    userName: "John Doe"
  }
}
```

## Database Indexes

Optimized queries with indexes on:

- `by_adminId`: Get activities by specific admin
- `by_timestamp`: Sort by recency
- `by_actionType`: Filter by action category

## Performance

- **Query Limit**: Default 50 recent activities
- **Real-time Updates**: Convex reactive queries
- **Efficient Filtering**: Server-side indexes
- **Lightweight**: Minimal data transfer

## Security

- **Admin-Only**: Only admins can view activity logs
- **Authentication Required**: Checks user identity
- **Role Validation**: Verifies admin role on backend
- **Audit Trail**: Immutable log records

## Future Enhancements

### Planned Features

- [ ] Create/Update/Delete activity logging
- [ ] User account creation tracking
- [ ] Property approval logging
- [ ] Deal status change tracking
- [ ] Search/filter by date range
- [ ] Export activity log
- [ ] Admin activity dashboard
- [ ] IP address tracking
- [ ] Bulk action logging

### Advanced Features (Optional)

- [ ] Real-time notifications (WebSocket)
- [ ] Email digest of daily activities
- [ ] Activity anomaly detection
- [ ] Admin permission change logs
- [ ] System configuration change tracking

## Files Created/Modified

### Created

- `convex/admin_activity.ts` - Backend queries/mutations
- `src/app/admin/_components/admin-notification-bell.tsx` - UI component
- `ADM04_ADMIN_NOTIFICATIONS.md` - This documentation

### Modified

- `convex/schema.ts` - Added admin_activity_logs table
- `src/app/admin/_components/admin-header.tsx` - Added notification bell
- `src/app/admin/_components/data-export.tsx` - Integrated activity logging
- `package.json` - Added date-fns dependency

### Dependencies Added

```json
{
  "date-fns": "^2.30.0"
}
```

## Testing Checklist

- [x] Activity logs created on export
- [x] Notification badge shows unread count
- [x] Badge clears when popover opens
- [x] Tabs filter activities correctly
- [x] Timestamps format correctly ("2 hours ago")
- [x] Icons and colors match action types
- [x] Scroll works with 50+ activities
- [x] localStorage persists last checked time
- [x] Real-time updates work (Convex reactivity)
- [x] Admin-only access enforced
- [x] Stats display correctly in header
- [x] Empty states show appropriate messages

## UI Screenshots (Description)

**Notification Bell (Unread)**:

- Bell icon with red badge "5"
- Located in admin header next to user avatar

**Notification Popover**:

- Header: "Admin Activity Log" | "Today: 12 • Week: 45"
- Tabs: All (50) | 📥 | 👤 | ✏️
- List: Recent activities with icons and timestamps
- Highlighted: Unread items with blue background

**Activity Item**:

- 🟢 Green icon (Download)
- "Exported Properties report (45 records)"
- "by Admin Name • 2 hours ago"
- Badge: "Properties"

## Conclusion

The Admin Activity Notification system provides real-time visibility into administrative actions. It serves as both an audit trail and a productivity tool, helping admins stay informed about system activities. The modular design allows easy extension to track additional action types as the system grows.
