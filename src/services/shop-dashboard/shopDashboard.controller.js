const { error, success } = require("../utils/responseHandler");
const Order = require('../../models/Order');
const mongoose = require("mongoose");

const getTopItemsController = async (req, res) => {
    const { shopId } = req.params;
    if (!shopId) return error(res, 'Missing Shop Id!', 400);
    if (!mongoose.Types.ObjectId.isValid(shopId)) {
        return error(res, 'Invalid Shop Id format!', 400);
    }
    const shopObjectId = new mongoose.Types.ObjectId(shopId);

    try {
        const [
            topSellingItems,
            dailyRevenue,
            weeklyRevenue,
            monthlyRevenue,
            todayRevenue,
            activeCustomers
        ] = await Promise.all([
            Order.aggregate([
                { $match: { shopId: shopObjectId }},
                { $unwind: "$items" },
                {
                    $group: {
                        _id: "$items.itemId",
                        name: { $first: "$items.name" },
                        quantitySold: { $sum: "$items.quantity" },
                        totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price" ]}}
                    }
                },
                { $sort: { quantitySold: -1 }},
                { $limit: 10 }
            ]),
            // Daily revenue last 24 hour
             Order.aggregate([
                {
                    $match: {
                        shopId: shopObjectId,
                        createdAt: {
                            $gte: new Date(new Date() - 24 * 60 * 60 * 1000)
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$totalAmount" }
                    }
                }
            ]),
             Order.aggregate([
                {
                    $match: {
                        shopId: shopObjectId,
                        createdAt: {
                            $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$totalAmount" }
                    }
                }
            ]),

            // Monthly Revenue (last 30 days)
            Order.aggregate([
                {
                    $match: {
                        shopId: shopObjectId,
                        createdAt: {
                            $gte: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$totalAmount" }
                    }
                }
            ]),

            // Today's Revenue
            Order.aggregate([
                {
                    $match: {
                        shopId: shopObjectId,
                        createdAt: {
                            $gte: new Date(new Date().setHours(0, 0, 0, 0))
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$totalAmount" }
                    }
                }
            ]),
            // Active Customers (who ordered in last 30 days)
            Order.aggregate([
                {
                    $match: {
                        shopId: shopObjectId,
                        createdAt: {
                            $gte: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
                        }
                    }
                }, 
                {
                    $group: {
                        _id: "$customerId",
                        lastOrderDate: { $max: "$createdAt" }
                    }
                },
                {
                    $lookup: {
                        from: "customers",
                        localField: "_id",
                        foreignField: "_id",
                        as: "customerInfo"
                    }
                },
                {
                    $project: {
                        customer: { $arrayElemAt: ["$customerInfo.name", 0] },
                        lastOrderDate: 1
                    }
                },
                { 
                    $sort: { lastOrderDate: -1 }
                }
            ])
        ]);
        console.log(weeklyRevenue)
        const dailyRev = parseFloat(dailyRevenue[0]?.total?.$numberDecimal || dailyRevenue[0]?.total || 0);
        const weeklyRev = parseFloat(weeklyRevenue[0]?.total?.$numberDecimal || weeklyRevenue[0]?.total || 0);

        const growthRate = calculateGrowthRate(dailyRev, weeklyRev);
        const result = {
            topSellingItems,
            dailyRevenue: dailyRevenue[0]?.total || 0,
            weeklyRevenue: weeklyRevenue[0]?.total || 0,
            monthlyRevenue: monthlyRevenue[0]?.total || 0,
            todayRevenue: todayRevenue[0]?.total || 0,
            activeCustomers,
            growthRate
        }
        return success(res, '', result);
    }
    catch (err) {
        console.error('Error fetching top items:', err);
        return error(res, 'Internal Server Error', 500);
    }
}

const getRevenueByHourController = async (req, res) => {
    const { shopId } = req.params;

    if (!shopId) return error(res, 'Missing Shop Id!', 400);
    if (!mongoose.Types.ObjectId.isValid(shopId)) {
        return error(res, 'Invalid Shop Id format!', 400);
    }

    const shopObjectId = new mongoose.Types.ObjectId(shopId);

    try {
        const result = await Order.aggregate([
            {
                $match: {
                    shopId: shopObjectId,
                    status: 'completed',
                    paymentStatus: 'paid'
                }
            },
            {
                $addFields: {
                    createdAtIST: {
                        $dateToParts: {
                            date: "$createdAt",
                            timezone: "Asia/Kolkata"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$createdAtIST.hour",
                    totalRevenue: { $sum: "$totalAmount" },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        const formatted = result.map(item => ({
            hour: `${item._id}:00`,
            revenue: item.totalRevenue,
            orders: item.orderCount
        }));

        return success(res, '', formatted);
    }
    catch (err) {
        console.error('Error fetching revenue by hour:', err);
        return error(res, 'Internal Server Error', 500);
    }
};

function calculateGrowthRate(current, previous) {
  const curr = typeof current === 'object' && current !== null ? parseFloat(current.$numberDecimal || 0) : parseFloat(current || 0);
  const prev = typeof previous === 'object' && previous !== null ? parseFloat(previous.$numberDecimal || 0) : parseFloat(previous || 0);

  if (isNaN(curr) || isNaN(prev)) return null;

  if (prev === 0) {
    return curr > 0 ? 100 : 0;
  }

  const change = ((curr - prev) / Math.abs(prev)) * 100;
  return parseFloat(change.toFixed(2));
}

module.exports = {
    getTopItemsController,
    getRevenueByHourController
}
