# mobilede-isv-calculator-extension
This repository contains a simple Google Chrome extension that can be used to provide on-the-fly tax calculations regarding the ISV (Imposto Sobre Ve√culos) when navigating through mobile.de

## How to use
Just install the chrome exension and then navigate to a mobile.de page that shows the details of a vehicle. If supported (in order  for the calculations to work we need to retrieve the emissions, engine size, registration date and fuel type) an orange box right below the original price will reveal the ISV and total cost.

![ISV calculation](https://github.com/zatarra/mobile.de-isv-calculator-extension/raw/main/isv.jpeg "ISV calculation")

## TODO
Although the extension provides basic functionality, it is nowhere near completion. Diesel, Petrol and Motorcycles are working, but all other types of cars (e.g. hybrid) still need to be added.  Feel free to create a PR with those. 
