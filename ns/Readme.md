Markdown documentation created by [pyLODE](http://github.com/rdflib/pyLODE) 2.4

# GreenInfraTwins (GRIT) Ontology

## Metadata
* **IRI**
  * `https://greeninfratwins.com/ns/grit#`
* **Creators(s)**
  * [Philipp Hagedorn](https://orcid.org/0000-0002-6249-243X)
    [[ORCID]](https://orcid.org/0000-0002-6249-243X)
    (<philipp.hagedorn-n6v@rub.de></a>) of [Ruhr University Bochum](https://www.inf.bi.ruhr-uni-bochum.de/iib/lehrstuhl/mitarbeiter/philipp_hagedorn.html.en)
* **Contributor(s)**
  * [Liu Liu](https://orcid.org/0000-0001-5907-7609)
    [[ORCID]](https://orcid.org/0000-0001-5907-7609)
    (<liu.liu-m6r@rub.de></a>) of [Ruhr University Bochum](https://www.inf.bi.ruhr-uni-bochum.de/iib/lehrstuhl/mitarbeiter/liu_liu.html.en)
  * [Simon Kosse](https://orcid.org/0000-0002-6391-784X)
    [[ORCID]](https://orcid.org/0000-0002-6391-784X)
    (<simon.kosse@rub.de></a>) of [Ruhr University Bochum](https://www.inf.bi.ruhr-uni-bochum.de/iib/lehrstuhl/mitarbeiter/simon_kosse.html.en)
* **Created**
  * 2024-08-01
* **Modified**
  * 2025-04-29
* **Version Information**
  * 1.0
* **License &amp; Rights**
  * [https://creativecommons.org/licenses/by/4.0/](https://creativecommons.org/licenses/by/4.0/)
  * &copy; 2024 by Chair of Computing in Engineering, Ruhr University Bochum
* **Source**
  * [https://www.greeninfratwins.com](https://www.greeninfratwins.com)
* **Ontology RDF**
  * RDF ([grit.ttl](turtle))
### Description
<p>The GreenInfraTwins (GRIT) Ontology is used for establishing digital twins for the sustainability assessment of transportaion infrastructure in Germany, Austria, and Switzerland. The aim of the research project is to conceptualise and demonstrate sustainability-related decision support through the use of digital twins of engineering structures. To this end, digital twins of engineering structures are created, enriched with data and used to calculate key indicators for sustainability analyses. </p>

## Table of Contents
1. [Classes](#classes)
1. [Object Properties](#objectproperties)
1. [Datatype Properties](#datatypeproperties)
1. [Named Individuals](#namedindividuals)
1. [Namespaces](#namespaces)
1. [Legend](#legend)


## Overview

**Figure 1:** Ontology overview
## Classes
[Activity](#Activity),
[Assessment defined by a specified Use Case](#AssessmentdefinedbyaspecifiedUseCase),
[Complex computed value indicator](#Complexcomputedvalueindicator),
[Constant value indicator](#Constantvalueindicator),
[GreenInfraTwin Demonstrator](#GreenInfraTwinDemonstrator),
[Indicator](#Indicator),
[Indicator set](#Indicatorset),
[Indicator type](#Indicatortype),
[Indicator variable](#Indicatorvariable),
[Measure](#Measure),
[Measure indicator](#Measureindicator),
[Measure variant](#Measurevariant),
[Reliability indicator](#Reliabilityindicator),
[Simple computed value indicator](#Simplecomputedvalueindicator),
[Specified use case](#Specifiedusecase),
[Technical quality indicator](#Technicalqualityindicator),
[Value indicator](#Valueindicator),
### Activity
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#Activity`
Description | <p>The activity that is performed in a particularly sequence within a measure or measure variant.</p>
Super-classes |[owl:Thing](http://www.w3.org/2002/07/owl#Thing) (c)<br />
Restrictions |[grit:hasIcddModelID](https://greeninfratwins.com/ns/grit#hasIcddModelID) (dp) **exactly** 1<br />[grit:hasIndicatorSet](https://greeninfratwins.com/ns/grit#hasIndicatorSet) (op) **exactly** 1 [grit:IndicatorSet](https://greeninfratwins.com/ns/grit#IndicatorSet) (c)<br />[grit:hasIfcGuid](https://greeninfratwins.com/ns/grit#hasIfcGuid) (dp) **some** [xsd:string](http://www.w3.org/2001/XMLSchema#string) (c)<br />[grit:afterActivity](https://greeninfratwins.com/ns/grit#afterActivity) (op) **some** [grit:Activity](https://greeninfratwins.com/ns/grit#Activity) (c)<br />
In domain of |[grit:hasIndicatorSet](https://greeninfratwins.com/ns/grit#hasIndicatorSet) (op)<br />[grit:hasIcddModelID](https://greeninfratwins.com/ns/grit#hasIcddModelID) (dp)<br />[grit:hasIfcGuid](https://greeninfratwins.com/ns/grit#hasIfcGuid) (dp)<br />[grit:afterActivity](https://greeninfratwins.com/ns/grit#afterActivity) (op)<br />
In range of |[grit:involvesActivities](https://greeninfratwins.com/ns/grit#involvesActivities) (op)<br />[grit:afterActivity](https://greeninfratwins.com/ns/grit#afterActivity) (op)<br />
### Assessment defined by a specified Use Case
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#Assessment`
Description | <p>The use case that is performed in a DT.</p>
Super-classes |[owl:Thing](http://www.w3.org/2002/07/owl#Thing) (c)<br />
Restrictions |[grit:hasMeasure](https://greeninfratwins.com/ns/grit#hasMeasure) (op) **some** [grit:Measure](https://greeninfratwins.com/ns/grit#Measure) (c)<br />[grit:isDefinedBy](https://greeninfratwins.com/ns/grit#isDefinedBy) (op) **max** 1 [grit:SpecifiedUseCase](https://greeninfratwins.com/ns/grit#SpecifiedUseCase) (c)<br />
In domain of |[grit:hasMeasure](https://greeninfratwins.com/ns/grit#hasMeasure) (op)<br />[grit:isDefinedBy](https://greeninfratwins.com/ns/grit#isDefinedBy) (op)<br />
In range of |[grit:hasAsessment](https://greeninfratwins.com/ns/grit#hasAsessment) (op)<br />
### Complex computed value indicator
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#ComplexComputedValueIndicator`
Description | <p>An indicator that cannot be calculated by just a given formula but in expert software.</p>
Super-classes |[grit:ValueIndicator](https://greeninfratwins.com/ns/grit#ValueIndicator) (c)<br />
Restrictions |[grit:hasVariable](https://greeninfratwins.com/ns/grit#hasVariable) (op) **some** [grit:IndicatorVariable](https://greeninfratwins.com/ns/grit#IndicatorVariable) (c)<br />[grit:hasExternalCalculationApplication](https://greeninfratwins.com/ns/grit#hasExternalCalculationApplication) (op) **exactly** 1<br />
In domain of |[grit:hasExternalCalculationApplication](https://greeninfratwins.com/ns/grit#hasExternalCalculationApplication) (op)<br />
### Constant value indicator
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#ConstantValueIndicator`
Description | <p>An indicator that does not change over time.</p>
Super-classes |[grit:ValueIndicator](https://greeninfratwins.com/ns/grit#ValueIndicator) (c)<br />
### GreenInfraTwin Demonstrator
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#GreenInfraTwin`
Description | <p>The instance of a DT for sustainability asessment.</p>
Super-classes |[owl:Thing](http://www.w3.org/2002/07/owl#Thing) (c)<br />
Restrictions |[grit:connectedServices](https://greeninfratwins.com/ns/grit#connectedServices) (op) **min** 0<br />[grit:hasAsessment](https://greeninfratwins.com/ns/grit#hasAsessment) (op) **some** [grit:Assessment](https://greeninfratwins.com/ns/grit#Assessment) (c)<br />[grit:hasIcddContainerID](https://greeninfratwins.com/ns/grit#hasIcddContainerID) (dp) **exactly** 1<br />[grit:hasIcddProjectID](https://greeninfratwins.com/ns/grit#hasIcddProjectID) (dp) **exactly** 1<br />
In domain of |[grit:hasIcddProjectID](https://greeninfratwins.com/ns/grit#hasIcddProjectID) (dp)<br />[grit:connectedServices](https://greeninfratwins.com/ns/grit#connectedServices) (op)<br />[grit:hasIcddContainerID](https://greeninfratwins.com/ns/grit#hasIcddContainerID) (dp)<br />[grit:hasAsessment](https://greeninfratwins.com/ns/grit#hasAsessment) (op)<br />
### Indicator
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#Indicator`
Description | <p>The generic indicator class, can be subtyped regarding their caracteristics and their value calculation methods.</p>
Super-classes |[owl:Thing](http://www.w3.org/2002/07/owl#Thing) (c)<br />
Restrictions |[grit:hasIndicatorType](https://greeninfratwins.com/ns/grit#hasIndicatorType) (op) **exactly** 1 [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType) (c)<br />
Sub-classes |[grit:ValueIndicator](https://greeninfratwins.com/ns/grit#ValueIndicator) (c)<br />[grit:ReliabilityIndicator](https://greeninfratwins.com/ns/grit#ReliabilityIndicator) (c)<br />[grit:MeasureIndicator](https://greeninfratwins.com/ns/grit#MeasureIndicator) (c)<br />[grit:TechnicalQualityIndicator](https://greeninfratwins.com/ns/grit#TechnicalQualityIndicator) (c)<br />
In domain of |[grit:hasIndicatorType](https://greeninfratwins.com/ns/grit#hasIndicatorType) (op)<br />
In range of |[grit:hasIndicator](https://greeninfratwins.com/ns/grit#hasIndicator) (op)<br />
### Indicator set
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet`
Description | <p>A set of indicators that is referenced by a specific activity.</p>
Super-classes |[owl:Thing](http://www.w3.org/2002/07/owl#Thing) (c)<br />
Restrictions |[grit:hasIndicator](https://greeninfratwins.com/ns/grit#hasIndicator) (op) **some** [grit:Indicator](https://greeninfratwins.com/ns/grit#Indicator) (c)<br />
In domain of |[grit:hasIndicator](https://greeninfratwins.com/ns/grit#hasIndicator) (op)<br />
In range of |[grit:hasIndicatorSet](https://greeninfratwins.com/ns/grit#hasIndicatorSet) (op)<br />[grit:grit:belongsToPredefinedSetOfIndicators](https://greeninfratwins.com/ns/grit#grit:belongsToPredefinedSetOfIndicators) (op)<br />
### Indicator type
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType`
Description | <p>A type for identifying indicators that should be aggregated in the overall calculation, e.g. GWP.</p>
Super-classes |[owl:Thing](http://www.w3.org/2002/07/owl#Thing) (c)<br />
Restrictions |[grit:hasIndicatorID](https://greeninfratwins.com/ns/grit#hasIndicatorID) (dp) **exactly** 1<br />
In domain of |[grit:grit:belongsToPredefinedSetOfIndicators](https://greeninfratwins.com/ns/grit#grit:belongsToPredefinedSetOfIndicators) (op)<br />[grit:hasIndicatorID](https://greeninfratwins.com/ns/grit#hasIndicatorID) (dp)<br />
In range of |[grit:hasIndicatorType](https://greeninfratwins.com/ns/grit#hasIndicatorType) (op)<br />
### Indicator variable
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorVariable`
Description | <p>The variable that is used to calculated for an indicator, consists of a key (the variable identified) and a value (the numerical value)</p>
Super-classes |[owl:Thing](http://www.w3.org/2002/07/owl#Thing) (c)<br />
Restrictions |[grit:mapsToLbdProperty](https://greeninfratwins.com/ns/grit#mapsToLbdProperty) (op) **exactly** 1<br />[grit:hasValue](https://greeninfratwins.com/ns/grit#hasValue) (op) **exactly** 1 [xsd:decimal](http://www.w3.org/2001/XMLSchema#decimal) (c)<br />[grit:hasUnit](https://greeninfratwins.com/ns/grit#hasUnit) (op) **exactly** 1 [p1:Unit](https://qudt.org/schema/qudt/Unit) (c)<br />[grit:hasKey](https://greeninfratwins.com/ns/grit#hasKey) (op) **exactly** 1 [xsd:string](http://www.w3.org/2001/XMLSchema#string) (c)<br />
In domain of |[grit:hasValue](https://greeninfratwins.com/ns/grit#hasValue) (op)<br />[grit:mapsToLbdProperty](https://greeninfratwins.com/ns/grit#mapsToLbdProperty) (op)<br />[grit:hasUnit](https://greeninfratwins.com/ns/grit#hasUnit) (op)<br />[grit:hasKey](https://greeninfratwins.com/ns/grit#hasKey) (op)<br />
In range of |[grit:hasVariable](https://greeninfratwins.com/ns/grit#hasVariable) (op)<br />
### Measure
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#Measure`
Description | <p>The definition of a measure.</p>
Super-classes |[owl:Thing](http://www.w3.org/2002/07/owl#Thing) (c)<br />
Restrictions |[grit:involvesActivities](https://greeninfratwins.com/ns/grit#involvesActivities) (op) **some** [grit:Activity](https://greeninfratwins.com/ns/grit#Activity) (c)<br />[grit:frequencyPerYear](https://greeninfratwins.com/ns/grit#frequencyPerYear) (op) **exactly** 1 [xsd:int](http://www.w3.org/2001/XMLSchema#int) (c)<br />[grit:hasMeasureVariant](https://greeninfratwins.com/ns/grit#hasMeasureVariant) (op) **some** [grit:MeasureVariant](https://greeninfratwins.com/ns/grit#MeasureVariant) (c)<br />
In domain of |[grit:hasMeasureVariant](https://greeninfratwins.com/ns/grit#hasMeasureVariant) (op)<br />[grit:involvesActivities](https://greeninfratwins.com/ns/grit#involvesActivities) (op)<br />[grit:frequencyPerYear](https://greeninfratwins.com/ns/grit#frequencyPerYear) (op)<br />
In range of |[grit:hasMeasure](https://greeninfratwins.com/ns/grit#hasMeasure) (op)<br />
### Measure indicator
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#MeasureIndicator`
Description | <p>An indicator used for being calculated in a measure for sustainability asessment.</p>
Super-classes |[grit:Indicator](https://greeninfratwins.com/ns/grit#Indicator) (c)<br />
### Measure variant
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#MeasureVariant`
Description | <p>An optional variant of the measure. A measure can either directly involve activities directly, or, if needed, can have multiple variants that each involve activities.</p>
Super-classes |[owl:Thing](http://www.w3.org/2002/07/owl#Thing) (c)<br />
Restrictions |[grit:involvesActivities](https://greeninfratwins.com/ns/grit#involvesActivities) (op) **some** [grit:Activity](https://greeninfratwins.com/ns/grit#Activity) (c)<br />
In domain of |[grit:involvesActivities](https://greeninfratwins.com/ns/grit#involvesActivities) (op)<br />
In range of |[grit:hasMeasureVariant](https://greeninfratwins.com/ns/grit#hasMeasureVariant) (op)<br />
### Reliability indicator
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#ReliabilityIndicator`
Description | <p>An indicator depicting the reliability of a measure.</p>
Super-classes |[grit:Indicator](https://greeninfratwins.com/ns/grit#Indicator) (c)<br />
### Simple computed value indicator
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#SimpleComputedValueIndicator`
Description | <p>An indicator that can be computed by a service by providing a formular and variables.</p>
Super-classes |[grit:ValueIndicator](https://greeninfratwins.com/ns/grit#ValueIndicator) (c)<br />
Restrictions |[grit:hasExternalCalculationServiceUrl](https://greeninfratwins.com/ns/grit#hasExternalCalculationServiceUrl) (op) **exactly** 1<br />[grit:hasVariable](https://greeninfratwins.com/ns/grit#hasVariable) (op) **some** [grit:IndicatorVariable](https://greeninfratwins.com/ns/grit#IndicatorVariable) (c)<br />[grit:hasFormula](https://greeninfratwins.com/ns/grit#hasFormula) (op) **exactly** 1 [xsd:string](http://www.w3.org/2001/XMLSchema#string) (c)<br />
In domain of |[grit:hasFormula](https://greeninfratwins.com/ns/grit#hasFormula) (op)<br />[grit:hasVariable](https://greeninfratwins.com/ns/grit#hasVariable) (op)<br />[grit:hasExternalCalculationServiceUrl](https://greeninfratwins.com/ns/grit#hasExternalCalculationServiceUrl) (op)<br />
### Specified use case
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#SpecifiedUseCase`
In range of |[grit:isDefinedBy](https://greeninfratwins.com/ns/grit#isDefinedBy) (op)<br />
### Technical quality indicator
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#TechnicalQualityIndicator`
Description | <p>An indicator for depicting the technical quality of a measure.</p>
Super-classes |[grit:Indicator](https://greeninfratwins.com/ns/grit#Indicator) (c)<br />
### Value indicator
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#ValueIndicator`
Description | <p>A class for all value indicators and subclasses. Cannot be used for calculating. For constant values see "git:ConstantValueIndicator".</p>
Super-classes |[grit:Indicator](https://greeninfratwins.com/ns/grit#Indicator) (c)<br />
Restrictions |[grit:hasUnit](https://greeninfratwins.com/ns/grit#hasUnit) (op) **exactly** 1 [p1:Unit](https://qudt.org/schema/qudt/Unit) (c)<br />[grit:hasValue](https://greeninfratwins.com/ns/grit#hasValue) (op) **exactly** 1<br />
Sub-classes |[grit:ComplexComputedValueIndicator](https://greeninfratwins.com/ns/grit#ComplexComputedValueIndicator) (c)<br />[grit:SimpleComputedValueIndicator](https://greeninfratwins.com/ns/grit#SimpleComputedValueIndicator) (c)<br />[grit:ConstantValueIndicator](https://greeninfratwins.com/ns/grit#ConstantValueIndicator) (c)<br />

## Object Properties
[after activity](#afteractivity),
[connected services](#connectedservices),
[frequency per year](#frequencyperyear),
[belongs to predefined set of indicators](#belongstopredefinedsetofindicators),
[has asessment](#hasasessment),
[has external calculation application](#hasexternalcalculationapplication),
[has calculation service](#hascalculationservice),
[has formula](#hasformula),
[has indicator](#hasindicator),
[has indicator set](#hasindicatorset),
[has indicator type](#hasindicatortype),
[has key](#haskey),
[has measure](#hasmeasure),
[has measure variant](#hasmeasurevariant),
[has unit](#hasunit),
[has value](#hasvalue),
[has variable](#hasvariable),
[involves activities](#involvesactivities),
[has specified use case](#hasspecifiedusecase),
[maps to lbd property](#mapstolbdproperty),
[](afteractivity)
### after activity
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#afterActivity`
Description | Establishes a procedural order of activities.
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:Activity](https://greeninfratwins.com/ns/grit#Activity) (c)<br />
Range(s) |[grit:Activity](https://greeninfratwins.com/ns/grit#Activity) (c)<br />
[](connectedservices)
### connected services
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#connectedServices`
Description | The services connected to a DT, e.g., ICDD container.
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:GreenInfraTwin](https://greeninfratwins.com/ns/grit#GreenInfraTwin) (c)<br />
[](frequencyperyear)
### frequency per year
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#frequencyPerYear`
Description | Displays the frequency of a measure per year.
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:Measure](https://greeninfratwins.com/ns/grit#Measure) (c)<br />
[](belongstopredefinedsetofindicators)
### belongs to predefined set of indicators
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#grit:belongsToPredefinedSetOfIndicators`
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType) (c)<br />
Range(s) |[grit:IndicatorSet](https://greeninfratwins.com/ns/grit#IndicatorSet) (c)<br />
[](hasasessment)
### has asessment
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasAsessment`
Description | The connection beween the DT and the use case / asessment.
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:GreenInfraTwin](https://greeninfratwins.com/ns/grit#GreenInfraTwin) (c)<br />
Range(s) |[grit:Assessment](https://greeninfratwins.com/ns/grit#Assessment) (c)<br />
[](hasexternalcalculationapplication)
### has external calculation application
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasExternalCalculationApplication`
Description | Indicates the external application in which the calculation of an indicator is performed.
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:ComplexComputedValueIndicator](https://greeninfratwins.com/ns/grit#ComplexComputedValueIndicator) (c)<br />
[](hascalculationservice)
### has calculation service
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasExternalCalculationServiceUrl`
Description | The URL of a calculation service that can calculate the indicator based on the given formula and the respective variables.
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:SimpleComputedValueIndicator](https://greeninfratwins.com/ns/grit#SimpleComputedValueIndicator) (c)<br />
[](hasformula)
### has formula
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasFormula`
Description | The calculation formular of a simple computed value indicator.
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:SimpleComputedValueIndicator](https://greeninfratwins.com/ns/grit#SimpleComputedValueIndicator) (c)<br />
[](hasindicator)
### has indicator
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasIndicator`
Description | The connection between an indicator set and the indicator. This relation may occur multiple times.
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:IndicatorSet](https://greeninfratwins.com/ns/grit#IndicatorSet) (c)<br />
Range(s) |[grit:Indicator](https://greeninfratwins.com/ns/grit#Indicator) (c)<br />
[](hasindicatorset)
### has indicator set
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasIndicatorSet`
Description | Establishes the connection between the activity and the respective indicators.
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:Activity](https://greeninfratwins.com/ns/grit#Activity) (c)<br />
Range(s) |[grit:IndicatorSet](https://greeninfratwins.com/ns/grit#IndicatorSet) (c)<br />
[](hasindicatortype)
### has indicator type
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasIndicatorType`
Description | Provides the indicator type.
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:Indicator](https://greeninfratwins.com/ns/grit#Indicator) (c)<br />
Range(s) |[grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType) (c)<br />
[](haskey)
### has key
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasKey`
Description | The key of a variable exactly as it appears in the calculation formula, e.g. v (for volume).
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:IndicatorVariable](https://greeninfratwins.com/ns/grit#IndicatorVariable) (c)<br />
[](hasmeasure)
### has measure
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasMeasure`
Description | The measures that are part of one assessment / use case.
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:Assessment](https://greeninfratwins.com/ns/grit#Assessment) (c)<br />
Range(s) |[grit:Measure](https://greeninfratwins.com/ns/grit#Measure) (c)<br />
[](hasmeasurevariant)
### has measure variant
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasMeasureVariant`
Description | A measure variant can be used to compare multiple variants of the same measure during the assessment.
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:Measure](https://greeninfratwins.com/ns/grit#Measure) (c)<br />
Range(s) |[grit:MeasureVariant](https://greeninfratwins.com/ns/grit#MeasureVariant) (c)<br />
[](hasunit)
### has unit
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasUnit`
Description | The unit that a value refers to.
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:IndicatorVariable](https://greeninfratwins.com/ns/grit#IndicatorVariable) (c)<br />
Range(s) |[p1:Unit](https://qudt.org/schema/qudt/Unit) (c)<br />
[](hasvalue)
### has value
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasValue`
Description | The value that should be computed by a calculation service for a given variable.
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:IndicatorVariable](https://greeninfratwins.com/ns/grit#IndicatorVariable) (c)<br />
[](hasvariable)
### has variable
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasVariable`
Description | The connection between the indicator ant the variables of an indicator.
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:SimpleComputedValueIndicator](https://greeninfratwins.com/ns/grit#SimpleComputedValueIndicator) (c)<br />
Range(s) |[grit:IndicatorVariable](https://greeninfratwins.com/ns/grit#IndicatorVariable) (c)<br />
[](involvesactivities)
### involves activities
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#involvesActivities`
Description | The activities that are performed within a measure or a measure variant.
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:MeasureVariant](https://greeninfratwins.com/ns/grit#MeasureVariant) (c)<br />[grit:Measure](https://greeninfratwins.com/ns/grit#Measure) (c)<br />
Range(s) |[grit:Activity](https://greeninfratwins.com/ns/grit#Activity) (c)<br />
[](hasspecifiedusecase)
### has specified use case
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#isDefinedBy`
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:Assessment](https://greeninfratwins.com/ns/grit#Assessment) (c)<br />
Range(s) |[grit:SpecifiedUseCase](https://greeninfratwins.com/ns/grit#SpecifiedUseCase) (c)<br />
[](mapstolbdproperty)
### maps to lbd property
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#mapsToLbdProperty`
Description | This property is used to map a variable of an indicator to a property present in the RDF dataset of the digital twin.
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:IndicatorVariable](https://greeninfratwins.com/ns/grit#IndicatorVariable) (c)<br />
Range(s) |[rdfs:Resource](http://www.w3.org/2000/01/rdf-schema#Resource) (c)<br />

## Datatype Properties
[has icdd container ID](#hasicddcontainerID),
[has icdd model id](#hasicddmodelid),
[has icdd project ID](#hasicddprojectID),
[has ifc guid](#hasifcguid),
[hasIndicatorID](#hasIndicatorID),
[](hasicddcontainerID)
### has icdd container ID
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasIcddContainerID`
Super-properties |[owl:topDataProperty](http://www.w3.org/2002/07/owl#topDataProperty)<br />
Domain(s) |[grit:GreenInfraTwin](https://greeninfratwins.com/ns/grit#GreenInfraTwin) (c)<br />
Range(s) |[xsd:anyURI](http://www.w3.org/2001/XMLSchema#anyURI) (c)<br />
[](hasicddmodelid)
### has icdd model id
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasIcddModelID`
Super-properties |[owl:topDataProperty](http://www.w3.org/2002/07/owl#topDataProperty)<br />
Domain(s) |[grit:Activity](https://greeninfratwins.com/ns/grit#Activity) (c)<br />
Range(s) |[xsd:string](http://www.w3.org/2001/XMLSchema#string) (c)<br />
[](hasicddprojectID)
### has icdd project ID
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasIcddProjectID`
Super-properties |[owl:topDataProperty](http://www.w3.org/2002/07/owl#topDataProperty)<br />
Domain(s) |[grit:GreenInfraTwin](https://greeninfratwins.com/ns/grit#GreenInfraTwin) (c)<br />
Range(s) |[xsd:anyURI](http://www.w3.org/2001/XMLSchema#anyURI) (c)<br />
[](hasifcguid)
### has ifc guid
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasIfcGuid`
Super-properties |[owl:topDataProperty](http://www.w3.org/2002/07/owl#topDataProperty)<br />
Domain(s) |[grit:Activity](https://greeninfratwins.com/ns/grit#Activity) (c)<br />
Range(s) |[xsd:string](http://www.w3.org/2001/XMLSchema#string) (c)<br />
[](hasIndicatorID)
### hasIndicatorID
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasIndicatorID`
Super-properties |[owl:topDataProperty](http://www.w3.org/2002/07/owl#topDataProperty)<br />
Domain(s) |[grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType) (c)<br />
Range(s) |[xsd:string](http://www.w3.org/2001/XMLSchema#string) (c)<br />

## Named Individuals
[Anzahl an Unfällen/Unfallrate im Normalbetrieb (bezogen auf den Zustand)](#AnzahlanUnfllen/UnfallrateimNormalbetrieb(bezogenaufdenZustand)),
[Arbeitssicherheit (Anzahl an Unfällen / Unfallrate im Baustellenbereich)](#Arbeitssicherheit(AnzahlanUnfllen/UnfallrateimBaustellenbereich)),
[Bauwerksbezogene Kosten](#BauwerksbezogeneKosten),
[Bauwerksbezogene Lebenszykluskosten](#BauwerksbezogeneLebenszykluskosten),
[Demontagefähigkeit](#Demontagefhigkeit),
[Eutrophierungspotential (EP)](#Eutrophierungspotential(EP)),
[Externe Kosten (monetarisierte externe Effekte)](#ExterneKosten(monetarisierteexterneEffekte)),
[Externe Umwelteffekte](#ExterneUmwelteffekte),
[Fläche des ökologisch gestörten Lebensraums durch Lärmbeeinträchtigung der Fauna](#FlchedeskologischgestrtenLebensraumsdurchLrmbeeintrchtigungderFauna),
[Flächeninanspruchnahme](#Flcheninanspruchnahme),
[Flächeninanspruchnahme (gesamt)](#Flcheninanspruchnahme(gesamt)),
[Flächeninanspruchnahme Bauprozesse (vorübergehend)](#FlcheninanspruchnahmeBauprozesse(vorbergehend)),
[Flächeninanspruchnahme Bauwerk (dauerhaft)](#FlcheninanspruchnahmeBauwerk(dauerhaft)),
[Globales Erwärmungspotential (GWP)](#GlobalesErwrmungspotential(GWP)),
[Kosten aufgrund von Zeitverlusten, Umleitungen und erhöhten Fahrzeugbetriebskosten ](#KostenaufgrundvonZeitverlusten,UmleitungenunderhhtenFahrzeugbetriebskosten),
[Kreislaufwirtschaft / Ressourcen](#Kreislaufwirtschaft/Ressourcen),
[Kumulierter Energieaufwand (KEA)](#KumulierterEnergieaufwand(KEA)),
[Lärmbeeinträchtigung von Menschen (Anzahl vom Lärm betroffene Personen)](#LrmbeeintrchtigungvonMenschen(AnzahlvomLrmbetroffenePersonen)),
[Lärmbeeinträchtigung von Menschen (Lärmpegel / Anzahl vom Lärm betroffene Personen)](#LrmbeeintrchtigungvonMenschen(Lrmpegel/AnzahlvomLrmbetroffenePersonen)),
[Lärmbeeinträchtigung von Menschen (gesamt)](#LrmbeeintrchtigungvonMenschen(gesamt)),
[Materialität des Bauwerks](#MaterialittdesBauwerks),
[Materialkosten](#Materialkosten),
[Materlaverwertung - Potentiale Kreislauffähigkeit](#Materlaverwertung-PotentialeKreislauffhigkeit),
[Monetärer Materialwert](#MonetrerMaterialwert),
[Nutzersicherheit](#Nutzersicherheit),
[Ozonbildungspotential (POCP)](#Ozonbildungspotential(POCP)),
[Ozonschichtabbaupotential (ODP)](#Ozonschichtabbaupotential(ODP)),
[Prozessbezogene Kosten (Planungs-, Baukosten, Kosten Nutzungsphase etc.)](#ProzessbezogeneKosten(Planungs-,Baukosten,KostenNutzungsphaseetc.)),
[Reduktion der zeitbezogenen Kapazität (Zeitverluste der Reisezeit; Veränderung Zuverlässigkeit der Reisezeit)](#ReduktionderzeitbezogenenKapazitt(ZeitverlustederReisezeit;VernderungZuverlssigkeitderReisezeit)),
[Risiken für die lokale Umwelt](#RisikenfrdielokaleUmwelt),
[Schad- und Risikostoffe](#Schad-undRisikostoffe),
[Schutzgut Mensch](#SchutzgutMensch),
[Sozio-kulturelle und funktionale Qualität](#Sozio-kulturelleundfunktionaleQualitt),
[Technische Qualität](#TechnischeQualitt),
[Verfügbarkeit](#Verfgbarkeit),
[Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeinträchtigungen (CO2)](#VerkehrsbedingteEmissioneninfolgebetrieblicherundbaubedingterVerkehrsbeeintrchtigungen(CO2)),
[Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeinträchtigungen (NOx)](#VerkehrsbedingteEmissioneninfolgebetrieblicherundbaubedingterVerkehrsbeeintrchtigungen(NOx)),
[Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeinträchtigungen (PM10)](#VerkehrsbedingteEmissioneninfolgebetrieblicherundbaubedingterVerkehrsbeeintrchtigungen(PM10)),
[Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeinträchtigungen (PM2.5)](#VerkehrsbedingteEmissioneninfolgebetrieblicherundbaubedingterVerkehrsbeeintrchtigungen(PM2.5)),
[Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeinträchtigungen (PM5)](#VerkehrsbedingteEmissioneninfolgebetrieblicherundbaubedingterVerkehrsbeeintrchtigungen(PM5)),
[Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeinträchtigungen (gesamt)](#VerkehrsbedingteEmissioneninfolgebetrieblicherundbaubedingterVerkehrsbeeintrchtigungen(gesamt)),
[Versauerungspotential (AP)](#Versauerungspotential(AP)),
[Zuverlässigkeit](#Zuverlssigkeit),
[Zuverlässigkeitsindex (beta-Wert)](#Zuverlssigkeitsindex(beta-Wert)),
[Ökobilanz](#kobilanz),
[Ökologische Qualität](#kologischeQualitt),
[Ökonomische Qualität](#konomischeQualitt),
### Verfügbarkeit <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_Availability`
* **Contributor(s)**
  * [grit:IndicatorSet](https://greeninfratwins.com/ns/grit#IndicatorSet)
### Bauwerksbezogene Lebenszykluskosten <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_BuildingRelatedLifecycleCosts`
* **Contributor(s)**
  * [grit:IndicatorSet](https://greeninfratwins.com/ns/grit#IndicatorSet)
### Kreislaufwirtschaft / Ressourcen <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_CircularEconomyResources`
* **Contributor(s)**
  * [grit:IndicatorSet](https://greeninfratwins.com/ns/grit#IndicatorSet)
### Ökologische Qualität <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_EcologicalQuality`
* **Contributor(s)**
  * [grit:IndicatorSet](https://greeninfratwins.com/ns/grit#IndicatorSet)
### Ökonomische Qualität <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_EconomicQuality`
* **Contributor(s)**
  * [grit:IndicatorSet](https://greeninfratwins.com/ns/grit#IndicatorSet)
### Externe Umwelteffekte <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_EnvironmentalEffects`
* **Contributor(s)**
  * [grit:IndicatorSet](https://greeninfratwins.com/ns/grit#IndicatorSet)
### Externe Kosten (monetarisierte externe Effekte) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_ExternalCosts`
* **Contributor(s)**
  * [grit:IndicatorSet](https://greeninfratwins.com/ns/grit#IndicatorSet)
### Schutzgut Mensch <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_HumanProtection`
* **Contributor(s)**
  * [grit:IndicatorSet](https://greeninfratwins.com/ns/grit#IndicatorSet)
### Flächeninanspruchnahme <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_LandUse`
* **Contributor(s)**
  * [grit:IndicatorSet](https://greeninfratwins.com/ns/grit#IndicatorSet)
### Ökobilanz <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_LifecycleAsessment`
* **Contributor(s)**
  * [grit:IndicatorSet](https://greeninfratwins.com/ns/grit#IndicatorSet)
### Risiken für die lokale Umwelt <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_LocalEnvironmentalRisks`
* **Contributor(s)**
  * [grit:IndicatorSet](https://greeninfratwins.com/ns/grit#IndicatorSet)
### Zuverlässigkeit <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_Reliability`
* **Contributor(s)**
  * [grit:IndicatorSet](https://greeninfratwins.com/ns/grit#IndicatorSet)
### Nutzersicherheit <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_Safety`
* **Contributor(s)**
  * [grit:IndicatorSet](https://greeninfratwins.com/ns/grit#IndicatorSet)
### Sozio-kulturelle und funktionale Qualität <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_SocioCulturalQuality`
* **Contributor(s)**
  * [grit:IndicatorSet](https://greeninfratwins.com/ns/grit#IndicatorSet)
### Technische Qualität <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_TechnicalQuality`
* **Contributor(s)**
  * [grit:IndicatorSet](https://greeninfratwins.com/ns/grit#IndicatorSet)
### Materialität des Bauwerks <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_1_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Materialität eines Bauwerks in Masse-Prozent
### Monetärer Materialwert <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_1_2`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von monetärer Materialwert in EUR
### Schad- und Risikostoffe <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_1_3`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Schad- und Risikostoffe in kg
### Demontagefähigkeit <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_1_4`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Demontagefaehigkeit mit qualitative Bewertungsergebnis
### Materlaverwertung - Potentiale Kreislauffähigkeit <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_1_5`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Materialverwertung zur potentialen Kreislauffaehigkeit in Massen-Prozent
### Fläche des ökologisch gestörten Lebensraums durch Lärmbeeinträchtigung der Fauna <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_2_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition Fläche des ökologisch gestörten Lebensraums durch Lärmbeeinträchtigung der Fauna in m2
### Flächeninanspruchnahme (gesamt) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_3_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Flächeninanspruchnahme Bauwerk (dauerhaft) und Bauprozesse (vorübergehend) in gewichtete m2
### Flächeninanspruchnahme Bauwerk (dauerhaft) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_3_1_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Flächeninanspruchnahme Bauwerk (dauerhaft)  in gewichtete m2
### Flächeninanspruchnahme Bauprozesse (vorübergehend) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_3_1_2`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Flächeninanspruchnahme Bauprozesse (vorübergehend) in gewichtete m2
### Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeinträchtigungen (gesamt) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_4_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeinträchtigungen in Masse
### Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeinträchtigungen (CO2) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_4_1_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeinträchtigungen in Masse
### Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeinträchtigungen (NOx) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_4_1_2`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeinträchtigungen in Masse
### Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeinträchtigungen (PM2.5) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_4_1_3`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeinträchtigungen in Masse
### Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeinträchtigungen (PM5) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_4_1_4`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeinträchtigungen in Masse
### Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeinträchtigungen (PM10) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_4_1_5`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeinträchtigungen in Masse
### Globales Erwärmungspotential (GWP) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_5_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Globales Erwärmungspotential (GWP) in kg CO2-Äquiv.
### Eutrophierungspotential (EP) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_5_2`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Eutrophierungspotential (EP) in kg PO43-Äquiv.
### Ozonschichtabbaupotential (ODP) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_5_3`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Ozonschichtabbaupotential (ODP) in kg R11-Äquiv.
### Versauerungspotential (AP) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_5_4`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Versauerungspotential (AP) in kg SO2-Äquiv.
### Ozonbildungspotential (POCP) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_5_5`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Ozonbildungspotential (POCP) in kg C2H4-Äquiv.
### Kumulierter Energieaufwand (KEA) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_5_6`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Kumulierter Energieaufwand (KEA) in MJ
### Bauwerksbezogene Kosten <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_2_1_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Materialkosten, prozessbezogene Kosten (Planungs-, Baukosten, Kosten Nutzungsphase etc.) in EUR
### Materialkosten <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_2_1_1_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Materialkosten - Teilkosten von Material-, prozessbezogene Kosten (Planungs-, Baukosten, Kosten Nutzungsphase etc.) in EUR
### Prozessbezogene Kosten (Planungs-, Baukosten, Kosten Nutzungsphase etc.) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_2_1_1_2`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Prozessbezogenekosten, Teilkosten von Material-, prozessbezogene Kosten (Planungs-, Baukosten, Kosten Nutzungsphase etc.) in EUR
### Kosten aufgrund von Zeitverlusten, Umleitungen und erhöhten Fahrzeugbetriebskosten  <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_2_2_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Kosten aufgrund von Zeitverlusten, Umleitungen und erhöhten Fahrzeugbetriebskosten in EUR
### Lärmbeeinträchtigung von Menschen (gesamt) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_3_1_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Lärmbeeinträchtigung von Menschen (Laermpegel / Anzahl vom Lärm betroffene Personen)
### Lärmbeeinträchtigung von Menschen (Lärmpegel / Anzahl vom Lärm betroffene Personen) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_3_1_1_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Lärmbeeinträchtigung von Menschen (Lärmpegel / Anzahl vom Lärm betroffene Personen) in db/pax
### Lärmbeeinträchtigung von Menschen (Anzahl vom Lärm betroffene Personen) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_3_1_1_2`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Lärmbeeinträchtigung von Menschen (Anzahl vom Lärm betroffene Personen) in Konzentration Schadstoffe
### Arbeitssicherheit (Anzahl an Unfällen / Unfallrate im Baustellenbereich) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_3_1_3`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Arbeitssicherheit (Anzahl an Unfällen / Unfallrate im Baustellenbereich) in pax / -
### Reduktion der zeitbezogenen Kapazität (Zeitverluste der Reisezeit; Veränderung Zuverlässigkeit der Reisezeit) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_3_2_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Reduktion der zeitbezogenen Kapazität (Zeitverluste der Reisezeit; Veränderung Zuverlässigkeit der Reisezeit) in %
### Zuverlässigkeitsindex (beta-Wert) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_4_1_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Zuverlässigkeitsindex (beta-Wert)
### Anzahl an Unfällen/Unfallrate im Normalbetrieb (bezogen auf den Zustand) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_4_2_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator für Definition von Anzahl an Unfällen/Unfallrate im Normalbetrieb (bezogen auf den Zustand)
## Namespaces
* **dc**
  * `http://purl.org/dc/terms/`
* **grit**
  * `https://greeninfratwins.com/ns/grit#`
* **owl**
  * `http://www.w3.org/2002/07/owl#`
* **p1**
  * `https://qudt.org/schema/qudt/`
* **prov**
  * `http://www.w3.org/ns/prov#`
* **rdf**
  * `http://www.w3.org/1999/02/22-rdf-syntax-ns#`
* **rdfs**
  * `http://www.w3.org/2000/01/rdf-schema#`
* **sdo**
  * `https://schema.org/`
* **skos**
  * `http://www.w3.org/2004/02/skos/core#`
* **vann**
  * `http://purl.org/vocab/vann/`
* **vs**
  * `http://www.w3.org/2003/06/sw-vocab-status/ns#`
* **xml**
  * `http://www.w3.org/XML/1998/namespace`
* **xsd**
  * `http://www.w3.org/2001/XMLSchema#`

## Legend
* Classes: c
* Object Properties: op
* Functional Properties: fp
* Data Properties: dp
* Annotation Properties: dp
* Properties: p
* Named Individuals: ni