export default function handler(req, res) {
  res.status(200).json({
    status: 'RealTradeNews API running',
    timestamp: new Date().toISOString()
  });
}
