import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ArrowUpDown } from 'lucide-react';
import axios from 'axios';

const FinancialApp = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [minRevenue, setMinRevenue] = useState('');
  const [maxRevenue, setMaxRevenue] = useState('');
  const [minNetIncome, setMinNetIncome] = useState('');
  const [maxNetIncome, setMaxNetIncome] = useState('');
  
  // Sorting states
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  // Format large numbers
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(num);
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=yqPA0AvlDFxCRGfZa6DcnA8a3zPlc2Yw`
        );
        setData(response.data);
        setFilteredData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...data];
    
    // Date range filter
    if (startYear) {
      result = result.filter(item => 
        new Date(item.date).getFullYear() >= parseInt(startYear)
      );
    }
    if (endYear) {
      result = result.filter(item => 
        new Date(item.date).getFullYear() <= parseInt(endYear)
      );
    }

    // Revenue range filter
    if (minRevenue) {
      result = result.filter(item => 
        item.revenue >= parseFloat(minRevenue) * 1000000000
      );
    }
    if (maxRevenue) {
      result = result.filter(item => 
        item.revenue <= parseFloat(maxRevenue) * 1000000000
      );
    }

    // Net Income range filter
    if (minNetIncome) {
      result = result.filter(item => 
        item.netIncome >= parseFloat(minNetIncome) * 1000000000
      );
    }
    if (maxNetIncome) {
      result = result.filter(item => 
        item.netIncome <= parseFloat(maxNetIncome) * 1000000000
      );
    }

    // Sort data
    result.sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      return sortDirection === 'asc'
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    });

    setFilteredData(result);
  }, [data, startYear, endYear, minRevenue, maxRevenue, minNetIncome, maxNetIncome, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center p-4">
      {error}
    </div>
  );

  return (
    <Card className="max-w-6xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Apple Inc. Financial Data</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Date Range</h3>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Start Year"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                className="w-full"
              />
              <Input
                type="number"
                placeholder="End Year"
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Revenue Range (Billions)</h3>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={minRevenue}
                onChange={(e) => setMinRevenue(e.target.value)}
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Max"
                value={maxRevenue}
                onChange={(e) => setMaxRevenue(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Net Income Range (Billions)</h3>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={minNetIncome}
                onChange={(e) => setMinNetIncome(e.target.value)}
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Max"
                value={maxNetIncome}
                onChange={(e) => setMaxNetIncome(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('date')}
                    className="font-medium"
                  >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
                <th className="p-4 text-left">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('revenue')}
                    className="font-medium"
                  >
                    Revenue
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
                <th className="p-4 text-left">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('netIncome')}
                    className="font-medium"
                  >
                    Net Income
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
                <th className="p-4 text-left">Gross Profit</th>
                <th className="p-4 text-left">EPS</th>
                <th className="p-4 text-left">Operating Income</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-4">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="p-4">{formatNumber(item.revenue)}</td>
                  <td className="p-4">{formatNumber(item.netIncome)}</td>
                  <td className="p-4">{formatNumber(item.grossProfit)}</td>
                  <td className="p-4">${item.eps.toFixed(2)}</td>
                  <td className="p-4">{formatNumber(item.operatingIncome)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialApp;