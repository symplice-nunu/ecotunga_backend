# 🎯 Graph Testing Guide

This guide will help you set up and test the beautiful waste collector performance graph with realistic data.

## 📊 Test Data Overview

The graph test data includes **7 months** of realistic waste collection data with a clear upward trend:

| Month | Collections | Trend |
|-------|-------------|-------|
| Oct 2024 | 12 | Starting |
| Nov 2024 | 18 | Increasing |
| Dec 2024 | 25 | Peak |
| Jan 2025 | 22 | Stable |
| Feb 2025 | 28 | Growing |
| Mar 2025 | 32 | Peak |
| Apr 2025 | 35 | Best |

**Total Collections**: 172 records
**Status Distribution**: ~70% completed, ~20% pending, ~10% denied

## 🚀 Quick Setup

### Option 1: Using the dedicated script (Recommended)

```bash
# Navigate to backend directory
cd ecotunga_backend

# Run the graph test data setup
npm run seed:graph
```

### Option 2: Using Knex seed

```bash
# Navigate to backend directory
cd ecotunga_backend

# Run the specific seed file
npx knex seed:run --specific=07_graph_test_data.js
```

## 📋 Prerequisites

Before running the graph test data, ensure you have:

1. **Users in the database** (run `npm run seed` first if needed)
2. **Companies in the database** (run `npm run seed` first if needed)
3. **Database migrations applied** (`npm run migrate`)

## 🎨 What You'll See

After running the test data, you can expect to see:

### 1. **Beautiful Chart Visualization**
- **Gradient bars** with hover effects
- **Target line** at 60% for performance comparison
- **Trend indicators** showing month-over-month changes
- **Animated elements** and smooth transitions

### 2. **Performance Metrics**
- **Total Collections**: 172
- **Average per Month**: ~25
- **Best Month**: 35 (April 2025)

### 3. **Performance Insights**
- **Consistency Score**: Calculated based on variance
- **Growth Trend**: Shows percentage growth over the period

### 4. **Interactive Features**
- **Hover tooltips** with detailed information
- **Color-coded bars** (green for above target, teal for below)
- **Trend arrows** (↗↘) showing performance changes

## 🔧 Testing Steps

1. **Set up the data**:
   ```bash
   npm run seed:graph
   ```

2. **Start the backend**:
   ```bash
   npm start
   ```

3. **Start the frontend** (in another terminal):
   ```bash
   cd ../ecotunga_frontend
   npm start
   ```

4. **Login as a waste collector**:
   - Use any existing waste_collector account
   - Or create a new one with role 'waste_collector'

5. **Navigate to Home page**:
   - The beautiful graph should be visible
   - You should see the 7-month trend clearly

## 📈 Expected Graph Behavior

### **Visual Elements**
- **7 bars** representing each month
- **Target line** in light blue
- **Gradient bars** in teal/green
- **Trend indicators** on bars with changes

### **Data Points**
- **Oct 2024**: 12 collections (starting point)
- **Nov 2024**: 18 collections (+6 from previous)
- **Dec 2024**: 25 collections (+7 from previous)
- **Jan 2025**: 22 collections (-3 from previous)
- **Feb 2025**: 28 collections (+6 from previous)
- **Mar 2025**: 32 collections (+4 from previous)
- **Apr 2025**: 35 collections (+3 from previous)

### **Performance Summary**
- **Total Collections**: 172
- **Average per Month**: 25
- **Best Month**: 35 (April 2025)
- **Growth Trend**: +192% (from 12 to 35)

## 🐛 Troubleshooting

### **No data showing**
- Check if the seed ran successfully
- Verify you're logged in as a waste_collector
- Check browser console for errors

### **Graph not loading**
- Ensure backend is running
- Check API endpoints are accessible
- Verify database connection

### **Wrong data showing**
- Clear existing data: `DELETE FROM waste_collection;`
- Re-run the seed: `npm run seed:graph`

## 🎯 Customization

You can modify the test data by editing `seeds/07_graph_test_data.js`:

- **Change monthly patterns** in the `monthlyPatterns` array
- **Adjust status distribution** in `getStatusDistribution` function
- **Modify time periods** or add more months
- **Change customer details** or locations

## 📊 Data Structure

The test data includes:
- **Realistic customer names** and contact information
- **Proper Rwandan addresses** (districts, sectors, cells)
- **Valid phone numbers** (+250 format)
- **Realistic pickup dates** within each month
- **Proper status distribution** for realistic scenarios

## 🎉 Success Indicators

You'll know the graph is working correctly when you see:

1. ✅ **7 bars** with clear upward trend
2. ✅ **Hover effects** showing collection counts
3. ✅ **Performance cards** with correct totals
4. ✅ **Insights section** with calculated metrics
5. ✅ **Smooth animations** and transitions
6. ✅ **Responsive design** on different screen sizes

---

**Happy Testing! 🚀**

The graph should now display beautiful, realistic data that demonstrates the waste collector's performance improvement over time. 