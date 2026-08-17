//Defining the data structure of a login input
export interface LoginData{       
    email: string;        
    password: string;   
}

//Defining the data structure of a signup input
export interface SignupData extends LoginData {
  name: string; // בהנחה שצריך גם שם בהרשמה
}