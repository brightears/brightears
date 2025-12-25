#!/bin/bash

# Make User Admin Script
# Usage: ./scripts/make-admin.sh <email>
# Example: ./scripts/make-admin.sh platzer.norbert@gmail.com

set -e

if [ -z "$1" ]; then
  echo "❌ Error: Email address required"
  echo "Usage: ./scripts/make-admin.sh <email>"
  exit 1
fi

EMAIL="$1"

echo "🔍 Checking for user with email: $EMAIL"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL environment variable not set"
  echo "Please set DATABASE_URL in your .env.local file or export it:"
  echo "export DATABASE_URL='your-database-url'"
  exit 1
fi

# Check if user exists
USER_EXISTS=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM \"User\" WHERE email = '$EMAIL';")

if [ "$USER_EXISTS" -eq 0 ]; then
  echo "❌ Error: User with email $EMAIL not found in database"
  echo ""
  echo "Please ensure the user has signed up first at:"
  echo "https://brightears.onrender.com/en/sign-up"
  echo ""
  echo "Then run this script again."
  exit 1
fi

echo "✅ User found in database"
echo "🔄 Updating role to ADMIN..."

# Update user role to ADMIN
psql "$DATABASE_URL" -c "UPDATE \"User\" SET role = 'ADMIN' WHERE email = '$EMAIL';"

if [ $? -eq 0 ]; then
  echo "✅ Success! User $EMAIL is now an ADMIN"
  echo ""
  echo "🎉 You can now access the admin dashboard at:"
  echo "https://brightears.onrender.com/en/dashboard/admin"
  echo ""
  echo "Please log out and log back in if you're already logged in."
else
  echo "❌ Error: Failed to update user role"
  exit 1
fi
