import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { repository } from '@loopback/repository';
import { Persona } from '../models';
import { PersonaRepository } from '../repositories';
import { Keys } from '../config/keys';
const generador = require("password-generator");
const cryptoJS = require("crypto-js"); 
const jwt = require("jsonwebtoken");

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    @repository(PersonaRepository)
    public personaRepository: PersonaRepository
  ) {}
  /*
   * Add service methods here
   */
  //8 es el numero de caracteres de la clave
  //con el false se le indica al codigo que genere una contrasenia con caracteres alfanumericos
  GenerarClave() {
    let clave = generador(8, false);
    return clave;
  }
  // se pasa como parametro la clave generada en la función anterior, indicando el tipo de datos qué es
  // MD5 es el método de encriptación (el MD5 lo encripta supuestamente en cinco capas)
  // al final se convierte a Strint a través del método toString()
  CifrarClave(clave: string) {
    let claveCifrada = cryptoJS.MD5(clave).toString();
    return claveCifrada;
  }

  IdentificarPersona(usuario:string, clave: string){
    try{
      let p = this.personaRepository.findOne({where:{email:usuario , clave:clave}});
      
      return p;
    }catch{
      return false;
    }
  }

  GenerarTokenJWT(persona: Persona){

    let token = jwt.sign({
      data:{
        id: persona.id,
        email: persona.email,
        nombre: persona.nombre + ' ' + persona.apellido
      }
    },Keys.claveJWT)
    return token;

  }

  ValidarTokerJWT(token: string){

    try{
      let datos = jwt.verify(token, Keys.claveJWT);
      return datos;
    }catch{
      return false;
    }
    
  }





}
