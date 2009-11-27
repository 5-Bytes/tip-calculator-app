class Observable{
	
	constructor(){
		this.observers=[];
	}
	
	subscribe(c){
		this.observers.push(c);
	}
	
	unsubscribe(c){
		this.observers = this.observers.filter(observer => observer instanceof c !== true);
	}
	
	notify(model){
		this.observers.forEach(observer => {
			observer.notify(model);
		});
	}
}

class notificarCuentaActual extends Observable {
	constructor(){
		super();
	}
	
	change(model){
		this.notify(model);
	}
}

class CalcularCuenta{
	
	constructor(){
		this.bill;
		this.people;
		this.porcentaje;
	}
	
	setBill(bill) {
		this.bill = bill
	}
	
	setPeople(people) {
		this.people = people
	}
	
	setPorcentaje(porcentaje) {
		this.porcentaje = porcentaje
	}
	
	reset() {
		this.bill = 0;
		this.people = 0;
		this.porcentaje = 0;
	}
	
	calcularPropina() {	
		return this.bill / this.people * this.porcentaje;
	}
	
	calcularTotal() {
		return this.bill / this.people + this.calcularPropina();
	}
	
	cuentaActual() {
		return {
			tipAmount: this.calcularPropina(),
			total: this.calcularTotal()
		}
	}
}

class OutputTotal{
	
	constructor(output){
		this.output = output;
	}
	
	notify(model){
		model.total = (!Number.isNaN(model.total) && Number.isFinite(model.total))? model.total : 0;
		this.output.value = Intl.NumberFormat('en-emodeng',{style:'currency',currency:'USD'}).format(model.total);
	}
}

class OutputTipAmount{
	
	constructor(output) {
		this.output = output;
	}
	
	notify(model){
		model.tipAmount = (!Number.isNaN(model.tipAmount) && Number.isFinite(model.tipAmount))? model.tipAmount : 0;
		this.output.value = Intl.NumberFormat('en-emodeng',{style:'currency',currency:'USD'}).format(model.tipAmount);
	}
}

let formLegends = document.querySelectorAll('.form__legend'),
 formBoxes = document.querySelectorAll('.form__box'),
 inputBill = document.querySelector('#bill'),
 inputNumberOfPeople = document.querySelector('#number-of-people'),
 btnPorcentajes = document.querySelector('#btn-porcentajes'),
 btnCustomTip = document.querySelector('#btn-custom-tip'),
 outputTipAmount = document.querySelector('#tip-amount'),
 outputTotal = document.querySelector('#total'),
 resetBtn = document.querySelector('#reset');
 
let calcularCuenta = new CalcularCuenta();
let notificacionDeCuenta = new notificarCuentaActual();
let oTotal = new OutputTotal(outputTotal);
let oTipAmount = new OutputTipAmount(outputTipAmount);

notificacionDeCuenta.subscribe(oTotal);
notificacionDeCuenta.subscribe(oTipAmount);

function removerClassName(element,className){
	element.classList.remove(className);
}

function añadirClassName(element,className){
	element.classList.add(className);
}

//REFACTORIZAR
inputBill.addEventListener('focus',()=>{
	añadirClassName(formBoxes[0],'form__box--focus')
});

inputNumberOfPeople.addEventListener('focus',()=>{
	añadirClassName(formBoxes[1],'form__box--focus')
});

inputBill.addEventListener('blur',()=>{
	removerClassName(formBoxes[0],'form__box--focus')
});

inputNumberOfPeople.addEventListener('blur',()=>{
	removerClassName(formBoxes[1],'form__box--focus');
});

inputBill.addEventListener('keyup',(e) => {
	if(parseFloat(e.target.value) > 0) {
		calcularCuenta.setBill(parseFloat(e.target.value));
		notificacionDeCuenta.change(calcularCuenta.cuentaActual())
	}
	
	if(parseFloat(e.target.value) < 1){
		formLegends[0].classList.add('form__legend--invalid');
		formBoxes[0].classList.add('form__box--invalid');
		formBoxes[0].classList.remove('form__box--focus');
	}else{
		formLegends[0].classList.remove('form__legend--invalid');
		formBoxes[0].classList.remove('form__box--invalid');
		formBoxes[0].classList.add('form__box--focus');
	}
});
	
inputNumberOfPeople.addEventListener('keyup',(e) => {
	if(parseFloat(e.target.value) > 0) {
		calcularCuenta.setPeople(parseFloat(e.target.value));
		notificacionDeCuenta.change(calcularCuenta.cuentaActual())
	}
	
	if(parseFloat(e.target.value) < 1){
		formLegends[1].classList.add('form__legend--invalid');
		formBoxes[1].classList.add('form__box--invalid');
		formBoxes[1].classList.remove('form__box--focus');
	}else{
		formLegends[1].classList.remove('form__legend--invalid');
		formBoxes[1].classList.remove('form__box--invalid');
		formBoxes[1].classList.add('form__box--focus');
	}
});

btnPorcentajes.addEventListener('click',(e)=> {
	e.preventDefault();
	calcularCuenta.setPorcentaje(parseFloat(e.target.dataset.tip));
	notificacionDeCuenta.change(calcularCuenta.cuentaActual())
});

btnCustomTip.addEventListener('keyup',(e)=> {
	if(parseFloat(e.target.value) > 0) {
		calcularCuenta.setPorcentaje(parseFloat(e.target.value/100));
		notificacionDeCuenta.change(calcularCuenta.cuentaActual())
	}
});

resetBtn.onclick = function () {
	calcularCuenta.reset();
	notificacionDeCuenta.change({total:0,tipAmount:0})
	document.querySelector('form').reset();
}