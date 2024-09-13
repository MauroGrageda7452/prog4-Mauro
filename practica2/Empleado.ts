
interface Salario{
    Calculo(e : Empleado) : number;
}

class SalarioPorHora implements Salario{
    
    constructor(){}

    Calculo(e : Empleado) {
        return e.getTarifa() * e.getHoras()
    }
}

class SalarioPorMes implements Salario{
    constructor(){}
    Calculo(e : Empleado) {
        return e.getSueldo();
    }
}


// Builder: 
    // -- Porque se llega a crear objetos en empleado pero variando para darle si tiene una tarifa por hora o un sueldo por mes. Aún así el obeto final es siempre un empleado que tinee un salario calculado basado en estas configuraciones.
//Factory
    // -- En comó determino que tipo de salario asignar al empleado (por hora o por mes) en el constructor de la clase Empleado, dependiendo de los valores proporcionados.

// Strategy : 
    // Está presente en la forma en que se maneja el cálculo del salario mediante las interfaces Salario y las clases SalarioPorHora y SalarioPorMes. Dependiendo del tipo de empleado,
    // el cálculo del salario cambia sin modificar la lógica del empleadi en sí, delegando la responsabilidad a un objeto externo. 


export class Empleado {
    private salario!: Salario;
    constructor(private horas:number,private tarifa = 0, private sueldo : number = 0) {

        if (!horas){
            throw new Error("Debe haber horas de trabajo realizadas")
        }

        if (tarifa === 0 && sueldo === 0){
            throw new Error("Debe haber una tarifa por hora o un sueldo por mes")
        }

        if (tarifa < 0 || sueldo < 0){
            throw new Error("La tarifa por hora no puede ser negativo, lo mismo para sueldo")

        }


        if (this.tarifa === 0 && this.sueldo !== 0){
            this.salario = new SalarioPorMes();
        }else if (this.sueldo === 0 && this.tarifa !== 0){
            this.salario = new SalarioPorHora()
        }
    }

    getTarifa(){
        return this.tarifa
    }
    getSueldo(){
        return this.sueldo
    }

    getHoras(){
        return this.horas
    }

    setTarifa(tarifa : number){
        this.tarifa = tarifa;

        if (this.salario instanceof SalarioPorHora){
            this.salario = new SalarioPorHora()
        }
        
        return this;
    }
    
    setSueldo(sueldo : number){
        this.sueldo = sueldo
        if (this.salario instanceof SalarioPorMes){
            this.salario = new SalarioPorMes();
        }
        return this;
    }

    CambioDeSalario() : Empleado{
        if (this.salario instanceof SalarioPorHora){
            this.setSueldo(this.horas * this.tarifa);
            this.setTarifa(0);
            this.salario = new SalarioPorMes();
        }else{
            this.setTarifa(this.sueldo / this.horas)
            this.setSueldo(0);
            this.salario = new SalarioPorHora();
        }
        return this
    }

    CalculoSalarioEmpleado(){
        return this.salario.Calculo(this);    
    }
}

class Reporte{
    empleados : Empleado[];
    constructor(private fecha : string , private hora : string){
        this.empleados =[];
    }

    Encabezado(){
        return (`Fecha : ${this.fecha} , Hora : ${this.hora}`)
    }

    AgregarEmpleados(e : Empleado){
        this.empleados.push(e);
    }
}

export class ReporteDeSalario extends Reporte{
    constructor(fecha : string, hora : string){
        super(fecha, hora)
    }

    SalarioEmpleados(){
        var totalSalario = 0;
        this.empleados.forEach(empleado => {
            totalSalario += empleado.CalculoSalarioEmpleado();
        });
        return totalSalario
    }
}

export class ReporteDeHoras extends Reporte{
    constructor( fecha: string , hora: string){
        super(fecha, hora)
    }

    HorasEmpleados(){        
        var totalHoras = 0;
        this.empleados.forEach(empleado => {
            totalHoras += empleado.getHoras();
        });
        return totalHoras
    }

}