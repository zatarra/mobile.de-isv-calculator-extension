const rawEmissions = document.getElementById("rbt-envkv.emission-v").innerText;
const rawRegistration = document.getElementById("rbt-firstRegistration-v").innerText;
const rawCC = document.getElementById("rbt-cubicCapacity-v").innerText;
const rawFuel = document.getElementById("rbt-fuel-v").innerText;
const pricePlaceholder = document.getElementById("rbt-pt-v");
const rawPrice = document.getElementById("rbt-pt-v").innerText;
 
const regexEmissions = /[0-9]+/g;
const regexRegistration = /[0-9]{2}\/[0-9]{4}/g;
const regexRawCC = /[0-9]+\.?[0-9+]/g;
const regexFuel = /[a-zA-Z\-]/g
const regexPrice = /[0-9,.]+/g

/* 
Types of Fuel

Benzin, Petrol
Elektro, Electric
Hybrid (petrol/electric), Hybrid (Benzin/Elektro)
Hybrid (diesel / electric), Hybrid (Diesel / Elektro)
Diesel
*/

function calculate_cc_tax(engineSize) {
  if(engineSize <= 1000)
    return (engineSize * 0.99) - 769.80;
  else if (engineSize <= 1250)
    return (engineSize * 1.07) - 771.31;
  else
    return (engineSize * 5.08) - 5616.80;
}

function calculate_co2_tax_diesel(emissions, measurement_type){
  if(measurement_type == "NEDC"){
    //console.log("Calculating CO2 tax using NEDC model for diesel: " + emissions.toString());
    if (emissions <= 79)
      return (emissions * 5.24) - 398.07;
    else if (emissions <= 95)
      return (emissions * 21.26) - 1676.08;
    else if (emissions <= 120)
      return (emissions * 71.83) - 6524.16;
    else if (emissions <= 140)
      return (emissions * 159.33) - 17158.92;
    else if (emissions <= 160)
      return (emissions * 177.19) - 19694.01;
    else
      return (emissions * 243.38) - 30326.67;
  }
  else if(measurement_type == "WLTP"){
    //console.log("Calculating CO2 tax using WLTP model for diesel: " + emissions.toString());
    if (emissions <= 110)
      return (emissions * 1.56) - 10.43;
    else if (emissions <= 120)
      return (emissions * 17.20) - 1728.32;
    else if (emissions <= 140)
      return (emissions * 58.97) - 6673.96;
    else if (emissions <= 150)
      return (emissions * 115.50) - 14580.00;
    else if (emissions <= 160)
      return (emissions * 145.80) - 19200.00;
    else if (emissions <= 170)
      return (emissions * 201.00) - 26500.00;
    else if (emissions <= 190)
      return (emissions * 248.50) - 33536.42;
    else
      return (emissions * 256.00) - 34700.00;
  }
  else
    return null;
}

function calculate_co2_tax_petrol(emissions, measurement_type){
  if(measurement_type == "NEDC"){
    //console.log("Calculating CO2 tax using NEDC model for Petrol: " + emissions.toString());
    if (emissions <= 99)
      return (emissions * 4.19) - 387.16;
    else if (emissions <= 115)
      return (emissions * 7.33) - 680.91;
    else if (emissions <= 145)
      return (emissions * 47.65) - 5353.01;
    else if (emissions <= 175)
      return (emissions * 55.52) - 6473.88;
    else if (emissions <= 195)
      return (emissions * 141.42) - 21422.47;
    else{
      return (emissions * 186.47) - 30274.29;
    }
  }
  else if(measurement_type == "WLTP"){
    //console.log("Calculating CO2 tax using WLTP model for Petrol: " + emissions.toString());
    if (emissions <= 110)
      return (emissions * 0.40) - 39.0;
    else if (emissions <= 115)
      return (emissions * 1.0) - 105.0;
    else if (emissions <= 120)
      return (emissions * 1.25) - 134.0;
    else if (emissions <= 130)
      return (emissions * 4.78) - 561.40;
    else if (emissions <= 145)
      return (emissions * 5.79) - 691.55;
    else if (emissions <= 175)
      return (emissions * 37.66) - 5276.50;
    else if (emissions <= 195)
      return (emissions * 46.58) - 6571.10;
    else if (emissions <= 235)
      return (emissions * 175.00) - 31000.00;
    else
      return (emissions * 212.00) - 38000.00;

  }
  else
    return null;
}

function cc_tax_cut(registrationDate){
  const now = new Date();
  const registration = parseDate(registrationDate);
  const diff = monthDiff(now, registration);
  //console.log("Difference in months between current date and registration date", diff.toString());

  if(diff < 12)
    return 0.10;
  else if(diff < 24)
    return 0.2; 
  else if(diff < 36)
    return 0.28; 
  else if(diff < 48)
    return 0.35; 
  else if(diff < 60)
    return 0.43; 
  else if(diff < 72)
    return 0.52; 
  else if(diff < 84)
    return 0.60; 
  else if(diff < 96)
    return 0.65; 
  else if(diff < 108)
    return 0.70; 
  else if(diff < 120)
    return 0.75; 
  else 
    return 0.8; 
}

function co2_tax_cut(registrationDate){
  const now = new Date();
  const registration = parseDate(registrationDate);
  const diff = monthDiff(now, registration);
  //console.log("Difference in months between current date and registration date", diff.toString());

  if(diff < 24)
    return 0.10;
  else if(diff < 48)
    return 0.2; 
  else if(diff < 72)
    return 0.28; 
  else if(diff < 84)
    return 0.35; 
  else if(diff < 108)
    return 0.43; 
  else if(diff < 120)
    return 0.6; 
  else if(diff < 156)
    return 0.65; 
  else if(diff < 168)
    return 0.7; 
  else if(diff < 180)
    return 0.75; 
  else 
    return 0.8; 
}

function monthDiff(dateFrom, dateTo) {
 return Math.abs(dateTo.getMonth() - dateFrom.getMonth() + 
   (12 * (dateTo.getFullYear() - dateFrom.getFullYear())));
}

function parseDate(myDate){
  var parts = myDate.split('/');
  return new Date(parts[2], parts[1] - 1, parts[0]); 
}

function computeTax(value, taxCut){
  return value*(1+taxCut);
}

function calculate_cost(cc, registrationDate, emissions, fuelType){
  //console.log("Calculating ISV for a " , fuelType , " car with " + cc.toString() + "cc registered on " + registrationDate.toString() + " emitting " + emissions.toString(), "g/km");
  
  const registrationDateObj = new Date(registrationDate);
  const cc_tax = calculate_cc_tax(parseInt(cc));
  const nedc_tax = (fuelType == "Petrol" ? calculate_co2_tax_petrol(parseInt(emissions), "NEDC") : calculate_co2_tax_diesel(parseInt(emissions), "NEDC"));
  const wltp_tax = (fuelType == "Petrol" ? calculate_co2_tax_petrol(parseInt(emissions), "WLTP"): calculate_co2_tax_diesel(parseInt(emissions), "NEDC"));
  const co2_cut = co2_tax_cut(registrationDate);
  const cc_cut = cc_tax_cut(registrationDate);
  
  const cc_total = cc_tax - ( cc_cut * cc_tax );
  const nedc_total = nedc_tax - Math.abs( co2_cut * nedc_tax);
  const wltp_total = wltp_tax - Math.abs( co2_cut * wltp_tax);
  const total_nedc = cc_total + nedc_total;
  const total_wltp = cc_total + wltp_total;

  if (DEBUG) {
    console.log("CC Tax " , cc_tax.toString());
    console.log("CC c/ desconto " , cc_total.toString());
    console.log("NEDC Total ", nedc_tax.toString());
    console.log("NEDC c/ desconto ", nedc_total.toString());
    console.log("WLTP Tax: " , wltp_tax.toString());
    console.log("WLTP c/desconto: " , wltp_total.toString());
    console.log("CO2 discount: " , co2_cut.toString()); 
    console.log("CC discount: " , cc_cut.toString()); 
    console.log("Total NEDC: " , total_nedc.toString());
    console.log("Total WLTP: " , total_wltp.toString());
  }

  if (registrationDateObj.getFullYear() < 2017)
    return {model: "nedc", value: total_nedc.toFixed(2)};
  if (registrationDateObj.getFullYear() >= 2020)
    return {model: "wltp", value: total_wltp.toFixed(2)};
  else
    return {nedc: total_nedc.toFixed(2), wltp: total_wltp.toFixed(2)};
}

const emissions = rawEmissions.match(regexEmissions)[0].trim();
const registration = rawRegistration.match(regexRegistration)[0].trim();
const cc = rawCC.match(regexRawCC).join("").split('.').join("").trim();
const fuel = rawFuel.match(regexFuel).join("").trim();
const price = parseFloat(rawPrice.match(regexPrice).join("").trim().replace(",", "").replace(".", "").trim());

console.log("Fuel type:" , fuel);
/* FINAL COST UPDATE*/
if (["Petrol", "Benzin", "Diesel"].includes(fuel)) {
  const total_tax = calculate_cost(cc, "01/" + registration, emissions, fuel);
  if ("model" in total_tax){
    console.log(total_tax.value.toString());
    const total_cost = Number(total_tax.value) + Number(price.toFixed(2));
    result = "<font color='red'><strong>ISV: </strong>€" + total_tax.value.toString() + " (" + total_tax.model.toString() + ")<br/>";
    result += "<font color='red'><strong>Total</strong></font>: €" + total_cost.toString();
  } else {
    result = "<font color='red'><strong>ISV: </strong>€" + parseFloat(total_tax.nedc) + " (NEDC)<br/>";
    result += "<font color='red'><strong>Total</strong></font>: €" + (parseFloat(total_tax.nedc) + parseFloat(price)).toFixed(2).toString() + " (NEDC)<br/>";
    result += "<font color='red'><strong>ISV: </strong>€" + parseFloat(total_tax.wltp) + " (WLTP)<br/>";
    result += "<font color='red'><strong>Total</strong></font>: €" + (parseFloat(total_tax.wltp) + parseFloat(price)).toFixed(2).toString() + " (WLTP)";
  }
    
  const total_cost = total_tax + price; 
  const priceTag = document.getElementById("rbt-pt-v").getElementsByTagName("span")[0];
  priceTag.innerHTML = priceTag.innerHTML + "<br/>" + result;
}
