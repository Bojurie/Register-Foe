import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Grid,
  Typography,
  Select,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";
import { useAuth } from "../AuthContext/AuthContext";
import "./ElectionRegistration.css";

function ElectionRegistrationForm({ candidatesList, onClose }) {
  const { user, enqueueSnackbar, handleCreateElection } = useAuth();

  const initialFormData = {
    title: "",
    electionType: "",
    city: "",
    state: "",
    description: "",
    startDate: "",
    endDate: "",
    companyCode: user?.companyCode || "",
    candidates: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  useEffect(() => {
    if (user?.companyCode) {
      setFormData((f) => ({
        ...f,
        companyCode: user.companyCode,
      }));
    }
  }, [user]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((f) => ({
      ...f,
      [name]: value,
    }));
  }, []);

  const handleCandidateSelection = useCallback((event) => {
    const { value } = event.target;
    setSelectedCandidates(value);
    setFormData((f) => ({
      ...f,
      candidates: value,
    }));
  }, []);

  const validateDates = () => {
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    return startDate < endDate;
  };

  const isFormComplete = () => {
    return (
      formData.title &&
      formData.electionType &&
      formData.city &&
      formData.state &&
      formData.startDate &&
      formData.endDate &&
      formData.description &&
      formData.candidates.length > 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateDates()) {
      enqueueSnackbar("Start date must be before end date", {
        variant: "error",
      });
      return;
    }

    if (!isFormComplete()) {
      enqueueSnackbar("Please fill all required fields", { variant: "error" });
      return;
    }

    if (!formData.companyCode) {
      enqueueSnackbar("Missing company code, unable to create election", {
        variant: "error",
      });
      return;
    }

    try {
      await handleCreateElection(formData);
      enqueueSnackbar("Election created successfully!", { variant: "success" });
      setFormData(initialFormData);
      setSelectedCandidates([]);
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to create election";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  return (
    <motion.div
      className="election-form-container"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h4" gutterBottom align="center">
        Create a New Election
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {[
            { label: "Title", name: "title" },
            { label: "City", name: "city" },
            { label: "State", name: "state" },
            { label: "Election Type", name: "electionType" },
            { label: "Start Date", name: "startDate", type: "date" },
            { label: "End Date", name: "endDate", type: "date" },
          ].map(({ label, name, type = "text" }) => (
            <Grid item xs={12} sm={6} key={name}>
              <TextField
                fullWidth
                label={label}
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              required
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Select Candidates</InputLabel>
              <Select
                multiple
                value={selectedCandidates}
                onChange={handleCandidateSelection}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {candidatesList.map((candidate) => (
                  <MenuItem key={candidate._id} value={candidate._id}>
                    {candidate.firstName} {candidate.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isFormComplete()}
            >
              Create Election
            </Button>
          </Grid>
        </Grid>
      </form>
    </motion.div>
  );
}

export default ElectionRegistrationForm;
