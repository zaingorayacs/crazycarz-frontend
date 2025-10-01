// ProductsLayout.jsx
import { Outlet } from 'react-router-dom';

export default function ProductsLayout() {
  return (
    <div className="p-4">
      {/* Common layout for all product pages, but NO product list here */}
      <Outlet />
    </div>
  );
}
