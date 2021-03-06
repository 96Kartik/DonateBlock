/*jshint esversion: 6, multistr: true, node: true*/

"use strict";

//NPM Modules
const mongoose          = require('mongoose'),
      Q                 = require('q'),
      _                 = require('lodash'),
      async             = require("async"),
//Internal Modules
      Campaign          = require('../model/Campaign'),
      util              = require('../util'),
      config            = require('../config');


module.exports = {

  createCampaign: async (new_details) => {

    let campaign  = new Campaign(new_details);

    let queryRes  = await campaign.save();
    return queryRes;
  },

  
  //user
  getAllCampaign: async () => {
    
    let queryRes = await Campaign.find({});
    return queryRes;
  },


  //organisation
  getSelfCampaign: async (org_id) => {

    let queryRes = await Campaign.find({campaignOrganisation: org_id});
    return queryRes;
    
  },

  campaignCompleted: async (campaign_id) => {

    let queryRes = await Campaign.findByIdAndUpdate({_id:campaign_id}, {$set: {deliverable: true}});
    if(queryRes){
    let result = await Campaign.findById({_id: campaign_id},{selectedVendorDetail:1});
    return result;
  }
  else{
    return false;
  }
  },

  getCampaignWallet: async (campaign_id) => {
    let queryRes =await Campaign.findById({_id: campaign_id}, {campaignWalletAddress:1} );
    return queryRes;
  },

  getCampaignById: async (campaign_id) => {
    let queryRes = await Campaign.findById({_id: campaign_id}).lean();
    return queryRes;
  },

  addSelectedVendorDetail: async(campaign_id, final_vendor, consignment_total_amount) => {
    let selectedVendorDetail = {
      vendorId: final_vendor._id,
      vendorName: final_vendor.vendorName,
      vendorPhone: final_vendor.vendorPhone,
      consignment_amount : consignment_total_amount,
      vendorWalletAddress: final_vendor.vendorWalletAddress,
    consignment_sent: false
    };
    let queryRes = await Campaign.update({_id: campaign_id},{$set: {selectedVendorDetail:selectedVendorDetail}});
    return queryRes;
  }

};
