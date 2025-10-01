#!/bin/bash

echo "Installing admin-specific dependencies..."

npm install \
  axios \
  jspdf \
  jspdf-autotable \
  react-easy-crop \
  react-spinners \
  recharts \
  lucide-react \
  @fortawesome/fontawesome-svg-core \
  @fortawesome/free-solid-svg-icons \
  @fortawesome/react-fontawesome

echo "Dependencies installed successfully!"
echo "You can now run: npm run dev"
