const dataBaseSQL = require("../databaseSQL/models");
const {Sequelize, DATE} = require('sequelize');

const path = require("path");

var apirest = {
    status: 0,
    codeError : "",
    objeto: {}
}

const bcrypt = require("bcrypt");

const funcionesGenericas = require("../funcionesGenerales");

const controlador = {

    index: async (req,res) => {
        try{
            
        }
        catch(error){

        }
    },

    newindicador: async (req,res) => {
        try{
            
        }
        catch(error){

        }
    },

    viewIndicadores: async (req,res) => {
        try{
            
        }
        catch(error){

        }
    },
    
    viewDetallesIndicadores: async (req,res) => {
        try{
            
        }
        catch(error){

        }
    },

    editIndicadores: async (req,res) => {
        try{
            
        }
        catch(error){

        }
    },

    deleteIndicadores: async (req,res) => {
        try{
            
        }
        catch(error){

        }
    },

    newMetrica: async (req,res) => {
        try{
            
        }
        catch(error){

        }
    },

    editMetrica: async (req,res) => {
        try{
            
        }
        catch(error){

        }
    },

    ultimasTresMetricas: async (req,res) => {
        try{
            
        }
        catch(error){

        }
    },
}



module.exports = controlador;