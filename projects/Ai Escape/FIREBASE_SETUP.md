# Firebase Setup Guide - Fixing PERMISSION_DENIED Error

## Problem
If you're seeing `PERMISSION_DENIED: Permission denied` when trying to start the game, this means your Firebase Realtime Database security rules are blocking write operations.

## Solution: Update Firebase Realtime Database Rules

### Step 1: Open Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project

### Step 2: Navigate to Realtime Database Rules
1. Click on **Realtime Database** in the left sidebar
2. Click on the **Rules** tab at the top

### Step 3: Update the Rules
Replace the existing rules with the following:

```json
{
  "rules": {
    "rooms": {
      ".read": true,
      ".write": true,
      "$roomCode": {
        ".validate": "newData.hasChildren(['roomCode', 'status', 'adminName'])",
        "status": {
          ".validate": "newData.isString() && (newData.val() === 'waiting' || newData.val() === 'playing' || newData.val() === 'finished')"
        }
      }
    },
    "players": {
      ".read": true,
      ".write": true,
      "$playerId": {
        ".validate": "newData.hasChildren(['identifier', 'name'])"
      }
    }
  }
}
```

### Step 4: Publish the Rules
1. Click **Publish** button at the top of the rules editor
2. Confirm the changes

## Alternative: Development Rules (Less Secure)
If you're only developing/testing and want temporary full access:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

⚠️ **Warning**: This allows anyone to read and write all data. Only use for development.

## Explanation
The game needs to:
- Create and update game rooms (`/rooms`)
- Add and update players (`/players`)
- Read room data for real-time updates

The rules above allow unauthenticated access to these specific paths while maintaining some validation to prevent malformed data.

## Testing
After updating the rules:
1. Try creating a new game room
2. Try joining a game room
3. Try starting a solo game

The `PERMISSION_DENIED` error should no longer appear.
