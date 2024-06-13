import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UsuarioDocument = Usuario & Document;

@Schema()
export class Usuario{
    @Prop()
    name:string;


    @Prop()
    email:string;


    @Prop()
    password:string;
}


export const UsuarioSchema = SchemaFactory.createForClass(Usuario);