import organisationModel from "../models/organisationModel.js";

// 🏗️ CREATE ORGANIZATION
export const createOrg = async (req, res) => {
  try {
    const { name, location, address, website, isActive } = req.body;

    if (!name || !location) {
      return res.status(400).send({
        success: false,
        message: "Name and location are mandatory",
      });
    }

    const newOrgRecord = new organisationModel({
      name,
      location,
      address,
      website,
      isActive,
    });

    const savedOrg = await newOrgRecord.save();

    res.status(201).send({
      success: true,
      message: "Organization created successfully",
      details: savedOrg,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({ success: false, message: e.message });
  }
};

// 📋 GET ALL ORGANIZATIONS
export const getAllOrg = async (req, res) => {
  try {
    const allOrganizations = await organisationModel
      .find({ isActive: true })
      .lean();

    if (!allOrganizations.length) {
      return res.status(404).send({
        success: false,
        message: "No organizations found",
      });
    }

    res.status(200).send({
      success: true,
      count: allOrganizations.length,
      details: allOrganizations,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({ success: false, message: e.message });
  }
};

// 🔍 GET ORGANIZATION BY ID
export const getOrgById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Organization ID is required",
      });
    }

    const orgDetails = await organisationModel.findById(id).lean();

    if (!orgDetails) {
      return res.status(404).send({
        success: false,
        message: "Organization not found",
      });
    }

    res.status(200).send({
      success: true,
      details: orgDetails,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({ success: false, message: e.message });
  }
};

// ✏️ UPDATE ORGANIZATION BY ID
export const updateOrgById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Organization ID is required",
      });
    }

    const updatedOrg = await organisationModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedOrg) {
      return res.status(404).send({
        success: false,
        message: "Organization not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Organization updated successfully",
      details: updatedOrg,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({ success: false, message: e.message });
  }
};

// 🗑️ SOFT DELETE ORGANIZATION
export const deleteOrg = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Organization ID is required",
      });
    }

    const result = await organisationModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!result) {
      return res.status(404).send({
        success: false,
        message: "Organization not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Organization deactivated successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({ success: false, message: e.message });
  }
};
