import * as analyticsService from '../services/analytics.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getOverview = asyncHandler(async (req, res) => {
  const data = await analyticsService.getAnalyticsOverview(req.query);
  return ApiResponse.success(res, 'Analytics overview retrieved successfully', data);
});

export const getBookingTrends = asyncHandler(async (req, res) => {
  const data = await analyticsService.getBookingTrends(req.query);
  return ApiResponse.success(res, 'Booking trends retrieved successfully', data);
});

export const getRevenueTrends = asyncHandler(async (req, res) => {
  const data = await analyticsService.getRevenueTrends(req.query);
  return ApiResponse.success(res, 'Revenue and COD collection trends retrieved successfully', data);
});

export const getCarPerformance = asyncHandler(async (req, res) => {
  const data = await analyticsService.getCarPerformance(req.query);
  return ApiResponse.success(res, 'Fleet performance analytics retrieved successfully', data);
});

export const getCategoryPerformance = asyncHandler(async (req, res) => {
  const data = await analyticsService.getCategoryPerformance(req.query);
  return ApiResponse.success(res, 'Category performance analytics retrieved successfully', data);
});

export const getCustomerAnalytics = asyncHandler(async (req, res) => {
  const data = await analyticsService.getCustomerAnalytics(req.query);
  return ApiResponse.success(res, 'Customer analytics retrieved successfully', data);
});

export const getReport = asyncHandler(async (req, res) => {
  const report = await analyticsService.generateReport(req.params.type, req.query);

  if (report.isCsv) {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
    return res.status(200).send(report.csvString);
  }

  return ApiResponse.success(res, `${req.params.type} report generated successfully`, report.records, 200, {
    totalItems: report.records.length,
    headers: report.headers,
  });
});

export default {
  getOverview,
  getBookingTrends,
  getRevenueTrends,
  getCarPerformance,
  getCategoryPerformance,
  getCustomerAnalytics,
  getReport,
};
