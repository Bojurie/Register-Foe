import React from 'react'
import './AdminDashboard.css'
import { motion } from 'framer-motion'

function CompanyDashboard() {
  return (
    <div>
      <motion.div
        className="Dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <h1>Admin</h1>
      </motion.div>
    </div>
  );
}

export default CompanyDashboard;