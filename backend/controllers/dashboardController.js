exports.getDashboardData = async (req, res) => {
  try {
    const { role } = req.user;

    if (role === "admin") {
      // Fetch admin-specific data
    } else if (role === "manager") {
      // Fetch manager-specific data
    } else if (role === "technician") {
      // Fetch technician-specific data
    } else if (role === "client") {
      // Fetch client-specific data
    }

    res.status(200).json({ message: "Dashboard data fetched successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
