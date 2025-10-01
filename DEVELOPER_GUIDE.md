# Developer Guide - Async Data Handling

## Quick Reference for Adding New Pages

### 1. Basic Page Structure with Data Fetching

```javascript
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useProductsData } from '../hooks/useProductData';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const MyPage = () => {
  // Fetch data
  const { products, loading, error, refetch, isEmpty } = useProductsData();

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <SkeletonLoader type="product" count={4} />
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage
            title="Error Loading Data"
            message={error}
            onRetry={refetch}
          />
        </div>
      </Layout>
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <EmptyState
            title="No Items Found"
            message="There are no items to display."
            actionText="Go Home"
            actionLink="/"
          />
        </div>
      </Layout>
    );
  }

  // Success state
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {products?.map(product => (
          <div key={product?._id || product?.id}>
            {product?.name || 'Unnamed Product'}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default MyPage;
```

### 2. Available Hooks

#### useProductData(productId)
Fetch a single product by ID.

```javascript
const { product, loading, error, refetch } = useProductData(productId);
```

#### useProductsData(filters)
Fetch multiple products with optional filters.

```javascript
const { products, loading, error, refetch, isEmpty } = useProductsData({ category: 'electronics' });
```

#### useProductsByCategory(categoryName)
Fetch products by category.

```javascript
const { products, loading, error, refetch, isEmpty } = useProductsByCategory('electronics');
```

#### useProductsByCompany(companyName)
Fetch products by company.

```javascript
const { products, loading, error, refetch, isEmpty } = useProductsByCompany('tesla');
```

### 3. Safe Data Access Patterns

#### Always Use Optional Chaining
```javascript
// ✅ Good
const name = product?.name || 'Default Name';
const price = product?.price || 0;
const image = product?.images?.[0] || 'fallback.jpg';

// ❌ Bad
const name = product.name; // Can throw error if product is undefined
```

#### Safe Array Operations
```javascript
// ✅ Good
const items = data?.items || [];
items?.map(item => item?.name)
items?.filter(Boolean) // Remove null/undefined

// ❌ Bad
const items = data.items;
items.map(item => item.name)
```

#### Safe Calculations
```javascript
// ✅ Good
const total = items?.reduce((sum, item) => sum + (item?.price || 0), 0) || 0;

// ❌ Bad
const total = items.reduce((sum, item) => sum + item.price, 0);
```

### 4. Component Templates

#### ErrorMessage Component
```javascript
<ErrorMessage
  title="Custom Error Title"
  message="Detailed error message"
  onRetry={refetch}
  showRetry={true}
/>
```

#### EmptyState Component
```javascript
<EmptyState
  icon={FaShoppingCart}
  title="Your cart is empty"
  message="Add some items to get started!"
  actionText="Shop Now"
  actionLink="/products"
/>
```

#### SkeletonLoader Component
```javascript
// Product skeleton
<SkeletonLoader type="product" />

// Multiple skeletons
<SkeletonLoader type="product" count={4} />

// Cart item skeleton
<SkeletonLoader type="cart-item" />

// Product detail skeleton
<SkeletonLoader type="product-detail" />

// Custom skeleton
<SkeletonLoader type="text" width="w-full" height="h-8" />
```

### 5. Common Patterns

#### Pattern 1: List with Loading/Error/Empty
```javascript
{loading ? (
  <SkeletonLoader type="product" count={4} />
) : error ? (
  <ErrorMessage message={error} onRetry={refetch} />
) : items?.length === 0 ? (
  <EmptyState title="No items" actionLink="/" />
) : (
  items?.map(item => <ItemCard key={item?._id} item={item} />)
)}
```

#### Pattern 2: Conditional Rendering with Fallback
```javascript
const product = apiProduct || staticFallback;

if (!product) {
  return <ErrorMessage title="Not Found" showRetry={false} />;
}
```

#### Pattern 3: Safe Form Submission
```javascript
const handleSubmit = async () => {
  try {
    const data = {
      name: formData?.name || '',
      email: formData?.email || '',
      items: cartItems?.map(item => ({
        id: item?._id || item?.id,
        quantity: item?.quantity || 1
      })) || []
    };
    
    await submitOrder(data);
    toast.success('Order placed!');
  } catch (error) {
    console.error('Submit error:', error);
    toast.error('Failed to place order');
  }
};
```

### 6. Styling Guidelines

#### Dark Mode Support
Always include dark mode classes:

```javascript
// ✅ Good
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">

// ❌ Bad
<div className="bg-white text-gray-900">
```

#### Responsive Design
Use responsive classes:

```javascript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
```

### 7. Error Handling Best Practices

#### API Calls
```javascript
try {
  const response = await apiService.getData();
  setData(response?.data || []);
} catch (error) {
  console.error('API Error:', error);
  setError(error?.message || 'Something went wrong');
  toast.error('Failed to load data');
}
```

#### User Actions
```javascript
const handleAction = async () => {
  try {
    await performAction();
    toast.success('Success!');
  } catch (error) {
    console.error('Action failed:', error);
    toast.error(error?.message || 'Action failed');
  }
};
```

### 8. Performance Tips

#### Memoization
```javascript
import { useMemo } from 'react';

const expensiveCalculation = useMemo(() => {
  return items?.reduce((total, item) => total + (item?.price || 0), 0);
}, [items]);
```

#### Callback Optimization
```javascript
import { useCallback } from 'react';

const handleClick = useCallback((id) => {
  // Handler logic
}, [dependencies]);
```

### 9. Testing Checklist

When adding a new page, test:

- [ ] Page loads with data successfully
- [ ] Page shows loading skeleton initially
- [ ] Page handles API errors gracefully
- [ ] Page shows empty state when no data
- [ ] All data access uses optional chaining
- [ ] Dark mode works correctly
- [ ] Responsive design works on mobile
- [ ] Retry functionality works (if applicable)
- [ ] Navigation works correctly
- [ ] No console errors or warnings

### 10. Common Mistakes to Avoid

#### ❌ Don't Do This
```javascript
// Direct property access
const name = product.name;

// Assuming arrays exist
items.map(item => ...)

// No error handling
const data = await fetchData();

// Hard-coded values
if (items.length === 0)

// No loading state
return <div>{data}</div>
```

#### ✅ Do This Instead
```javascript
// Safe property access
const name = product?.name || 'Default';

// Safe array operations
items?.map(item => ...) || []

// Proper error handling
try {
  const data = await fetchData();
} catch (error) {
  handleError(error);
}

// Safe comparisons
if (items?.length === 0)

// Proper loading state
if (loading) return <SkeletonLoader />;
return <div>{data}</div>
```

### 11. Code Review Checklist

Before submitting code, verify:

- [ ] All API calls have error handling
- [ ] All data access uses optional chaining (`?.`)
- [ ] Loading states are implemented
- [ ] Error states are handled
- [ ] Empty states are shown when appropriate
- [ ] Dark mode classes are included
- [ ] Responsive design is implemented
- [ ] No hardcoded values
- [ ] Console logs are removed (except intentional debugging)
- [ ] TypeScript types are correct (if using TS)
- [ ] Code follows existing patterns
- [ ] Comments explain complex logic

### 12. Debugging Tips

#### Check Data Structure
```javascript
useEffect(() => {
  console.log('Data:', data);
  console.log('Type:', typeof data);
  console.log('Is Array:', Array.isArray(data));
}, [data]);
```

#### Monitor Loading States
```javascript
useEffect(() => {
  console.log('Loading:', loading, 'Error:', error, 'Data:', data);
}, [loading, error, data]);
```

#### Test Error Scenarios
```javascript
// Temporarily force an error to test error handling
const { data, loading, error } = useProductsData();
const testError = true; // Toggle this
if (testError) {
  return <ErrorMessage title="Test Error" onRetry={() => {}} />;
}
```

## Quick Commands

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm test
```

### Lint Code
```bash
npm run lint
```

## Need Help?

- Check `REFACTORING_SUMMARY.md` for detailed architecture
- Review existing pages for patterns
- Test with slow network in Chrome DevTools
- Use React DevTools to inspect component state

## Resources

- [React Documentation](https://react.dev)
- [Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- [Nullish Coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
- [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
