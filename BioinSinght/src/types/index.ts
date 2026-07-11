export interface ResultItem{

    name:string;

    date:string;

    value:string;

    unit:string;

    badge:string;

    tone:"danger"|"warning"|"success";

    icon:string;

}

export interface AlertItem{

    title:string;

    description:string;

    time:string;

    tone:"critical"|"warning"|"info";

}

export interface EvolutionPoint{

    month:string;

    value:number;

}

export interface InterestOption{

    key:string;

    title:string;

    subtitle:string;

    icon:string;

}

export type AuthStackParamList = {

Login: undefined;

Onboarding: undefined;

Main: undefined;

};