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
1. [Annotation Properties](#annotationproperties)
1. [Named Individuals](#namedindividuals)
1. [Namespaces](#namespaces)
1. [Legend](#legend)


## Overview

**Figure 1:** Ontology overview
## Classes
[Activity](#Activity),
[Assessment defined by a specified Use Case](#AssessmentdefinedbyaspecifiedUseCase),
[Asset](#Asset),
[Asset utilization](#Assetutilization),
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
[Person](#Person),
[Predefined indicator set](#Predefinedindicatorset),
[Reliability indicator](#Reliabilityindicator),
[Resource](#Resource),
[Simple computed value indicator](#Simplecomputedvalueindicator),
[Specified use case](#Specifiedusecase),
[Technical quality indicator](#Technicalqualityindicator),
[Value indicator](#Valueindicator),
### Resource
Property | Value
--- | ---
IRI | `http://www.w3.org/2000/01/rdf-schema#Resource`
In range of |[grit:mapsToLbdProperty](https://greeninfratwins.com/ns/grit#mapsToLbdProperty) (op)<br />
### Activity
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#Activity`
Description | <p>The activity that is performed in a particularly sequence within a measure or measure variant.</p>
Super-classes |[owl:Thing](http://www.w3.org/2002/07/owl#Thing) (c)<br />
Restrictions |[grit:hasIfcGuid](https://greeninfratwins.com/ns/grit#hasIfcGuid) (dp) **some** [xsd:string](http://www.w3.org/2001/XMLSchema#string) (c)<br />[grit:hasIcddModelID](https://greeninfratwins.com/ns/grit#hasIcddModelID) (dp) **exactly** 1<br />[grit:executedAtDate](https://greeninfratwins.com/ns/grit#executedAtDate) (dp) **some** [xsd:dateTime](http://www.w3.org/2001/XMLSchema#dateTime) (c)<br />[grit:afterActivity](https://greeninfratwins.com/ns/grit#afterActivity) (op) **some** [grit:Activity](https://greeninfratwins.com/ns/grit#Activity) (c)<br />[grit:hasIndicatorSet](https://greeninfratwins.com/ns/grit#hasIndicatorSet) (op) **exactly** 1 [grit:IndicatorSet](https://greeninfratwins.com/ns/grit#IndicatorSet) (c)<br />[grit:hasAssetUtilization](https://greeninfratwins.com/ns/grit#hasAssetUtilization) (op) **some** [grit:AssetUtilization](https://greeninfratwins.com/ns/grit#AssetUtilization) (c)<br />
In domain of |[grit:hasIndicatorSet](https://greeninfratwins.com/ns/grit#hasIndicatorSet) (op)<br />[grit:executedAtDate](https://greeninfratwins.com/ns/grit#executedAtDate) (dp)<br />[grit:hasAssetUtilization](https://greeninfratwins.com/ns/grit#hasAssetUtilization) (op)<br />[grit:hasIcddModelID](https://greeninfratwins.com/ns/grit#hasIcddModelID) (dp)<br />[grit:afterActivity](https://greeninfratwins.com/ns/grit#afterActivity) (op)<br />[grit:hasIfcGuid](https://greeninfratwins.com/ns/grit#hasIfcGuid) (dp)<br />
In range of |[grit:afterActivity](https://greeninfratwins.com/ns/grit#afterActivity) (op)<br />[grit:involvesActivities](https://greeninfratwins.com/ns/grit#involvesActivities) (op)<br />
### Assessment defined by a specified Use Case
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#Assessment`
Description | <p>The use case that is performed in a DT.</p>
Super-classes |[owl:Thing](http://www.w3.org/2002/07/owl#Thing) (c)<br />
Restrictions |[grit:isDefinedBy](https://greeninfratwins.com/ns/grit#isDefinedBy) (op) **max** 1 [grit:SpecifiedUseCase](https://greeninfratwins.com/ns/grit#SpecifiedUseCase) (c)<br />[grit:hasMeasure](https://greeninfratwins.com/ns/grit#hasMeasure) (op) **some** [grit:Measure](https://greeninfratwins.com/ns/grit#Measure) (c)<br />
In domain of |[grit:isDefinedBy](https://greeninfratwins.com/ns/grit#isDefinedBy) (op)<br />[grit:hasMeasure](https://greeninfratwins.com/ns/grit#hasMeasure) (op)<br />
In range of |[grit:hasAssessment](https://greeninfratwins.com/ns/grit#hasAssessment) (op)<br />
### Asset
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#Asset`
Description | <p>Models an asset that can be used for a measure and provides properties to define indicators per hour operating time.</p>
Super-classes |[owl:Thing](http://www.w3.org/2002/07/owl#Thing) (c)<br />
In range of |[grit:hasAsset](https://greeninfratwins.com/ns/grit#hasAsset) (op)<br />
### Asset utilization
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#AssetUtilization`
Description | <p>Provides information about the utilization of a particular asset for an activity.</p>
Super-classes |[owl:Thing](http://www.w3.org/2002/07/owl#Thing) (c)<br />
Restrictions |[grit:operationTimeInHours](https://greeninfratwins.com/ns/grit#operationTimeInHours) (dp) **exactly** 1<br />[grit:hasAsset](https://greeninfratwins.com/ns/grit#hasAsset) (op) **exactly** 1 [grit:Asset](https://greeninfratwins.com/ns/grit#Asset) (c)<br />
In domain of |[grit:hasAsset](https://greeninfratwins.com/ns/grit#hasAsset) (op)<br />[grit:operationTimeInHours](https://greeninfratwins.com/ns/grit#operationTimeInHours) (dp)<br />
In range of |[grit:calculatesForAsset](https://greeninfratwins.com/ns/grit#calculatesForAsset) (op)<br />[grit:hasAssetUtilization](https://greeninfratwins.com/ns/grit#hasAssetUtilization) (op)<br />
### Complex computed value indicator
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#ComplexComputedValueIndicator`
Description | <p>An indicator that cannot be calculated by just a given formula but in expert software.</p>
Super-classes |[grit:ValueIndicator](https://greeninfratwins.com/ns/grit#ValueIndicator) (c)<br />
Restrictions |[grit:hasExternalCalculationApplication](https://greeninfratwins.com/ns/grit#hasExternalCalculationApplication) (op) **exactly** 1<br />[grit:hasVariable](https://greeninfratwins.com/ns/grit#hasVariable) (op) **some** [grit:IndicatorVariable](https://greeninfratwins.com/ns/grit#IndicatorVariable) (c)<br />
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
Description | <p>The instance of a DT for sustainability assessment.</p>
Super-classes |[owl:Thing](http://www.w3.org/2002/07/owl#Thing) (c)<br />
Restrictions |[grit:connectedServices](https://greeninfratwins.com/ns/grit#connectedServices) (op) **min** 0<br />[grit:hasIcddContainerID](https://greeninfratwins.com/ns/grit#hasIcddContainerID) (dp) **some** [xsd:string](http://www.w3.org/2001/XMLSchema#string) (c)<br />[grit:hasIcddContainerID](https://greeninfratwins.com/ns/grit#hasIcddContainerID) (dp) **exactly** 1<br />[grit:hasIcddProjectID](https://greeninfratwins.com/ns/grit#hasIcddProjectID) (dp) **exactly** 1<br />[grit:hasCountryCode](https://greeninfratwins.com/ns/grit#hasCountryCode) (dp) **some** [xsd:string](http://www.w3.org/2001/XMLSchema#string) (c)<br />[grit:hasIcddProjectID](https://greeninfratwins.com/ns/grit#hasIcddProjectID) (dp) **some** [xsd:string](http://www.w3.org/2001/XMLSchema#string) (c)<br />[grit:hasAssessment](https://greeninfratwins.com/ns/grit#hasAssessment) (op) **some** [grit:Assessment](https://greeninfratwins.com/ns/grit#Assessment) (c)<br />[grit:hasCountryCode](https://greeninfratwins.com/ns/grit#hasCountryCode) (dp) **exactly** 1<br />[grit:hasAssessment](https://greeninfratwins.com/ns/grit#hasAssessment) (op) **min** 1 [grit:Assessment](https://greeninfratwins.com/ns/grit#Assessment) (c)<br />
In domain of |[grit:hasAssessment](https://greeninfratwins.com/ns/grit#hasAssessment) (op)<br />[grit:connectedServices](https://greeninfratwins.com/ns/grit#connectedServices) (op)<br />[grit:hasCountryCode](https://greeninfratwins.com/ns/grit#hasCountryCode) (dp)<br />[grit:hasIcddProjectID](https://greeninfratwins.com/ns/grit#hasIcddProjectID) (dp)<br />[grit:hasIcddContainerID](https://greeninfratwins.com/ns/grit#hasIcddContainerID) (dp)<br />
### Indicator
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#Indicator`
Description | <p>The generic indicator class, can be subtyped regarding their caracteristics and their value calculation methods.</p>
Super-classes |[owl:Thing](http://www.w3.org/2002/07/owl#Thing) (c)<br />
Restrictions |[grit:hasIndicatorType](https://greeninfratwins.com/ns/grit#hasIndicatorType) (op) **exactly** 1 [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType) (c)<br />
Sub-classes |[grit:TechnicalQualityIndicator](https://greeninfratwins.com/ns/grit#TechnicalQualityIndicator) (c)<br />[grit:ValueIndicator](https://greeninfratwins.com/ns/grit#ValueIndicator) (c)<br />[grit:MeasureIndicator](https://greeninfratwins.com/ns/grit#MeasureIndicator) (c)<br />[grit:ReliabilityIndicator](https://greeninfratwins.com/ns/grit#ReliabilityIndicator) (c)<br />
In domain of |[grit:hasIndicatorType](https://greeninfratwins.com/ns/grit#hasIndicatorType) (op)<br />
In range of |[grit:hasIndicator](https://greeninfratwins.com/ns/grit#hasIndicator) (op)<br />
### Indicator set
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet`
Description | <p>A set of indicators that is referenced by a specific activity.</p>
Super-classes |[owl:Thing](http://www.w3.org/2002/07/owl#Thing) (c)<br />
Restrictions |[grit:hasPredefinedIndicatorSet](https://greeninfratwins.com/ns/grit#hasPredefinedIndicatorSet) (op) **exactly** 1 [grit:PredefinedIndicatorSet](https://greeninfratwins.com/ns/grit#PredefinedIndicatorSet) (c)<br />[grit:hasIndicator](https://greeninfratwins.com/ns/grit#hasIndicator) (op) **some** [grit:Indicator](https://greeninfratwins.com/ns/grit#Indicator) (c)<br />
Sub-classes |[grit:PredefinedIndicatorSet](https://greeninfratwins.com/ns/grit#PredefinedIndicatorSet) (c)<br />
In domain of |[grit:hasPredefinedIndicatorSet](https://greeninfratwins.com/ns/grit#hasPredefinedIndicatorSet) (op)<br />[grit:hasIndicator](https://greeninfratwins.com/ns/grit#hasIndicator) (op)<br />
In range of |[grit:belongsToPredefinedSetOfIndicators](https://greeninfratwins.com/ns/grit#belongsToPredefinedSetOfIndicators) (op)<br />[grit:hasIndicatorSet](https://greeninfratwins.com/ns/grit#hasIndicatorSet) (op)<br />
### Indicator type
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType`
Description | <p>A type for identifying indicators that should be aggregated in the overall calculation, e.g. GWP.</p>
Super-classes |[owl:Thing](http://www.w3.org/2002/07/owl#Thing) (c)<br />
Restrictions |[grit:hasIndicatorID](https://greeninfratwins.com/ns/grit#hasIndicatorID) (dp) **exactly** 1<br />
In domain of |[grit:hasIndicatorID](https://greeninfratwins.com/ns/grit#hasIndicatorID) (dp)<br />[grit:belongsToPredefinedSetOfIndicators](https://greeninfratwins.com/ns/grit#belongsToPredefinedSetOfIndicators) (op)<br />
In range of |[grit:hasIndicatorType](https://greeninfratwins.com/ns/grit#hasIndicatorType) (op)<br />
### Indicator variable
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorVariable`
Description | <p>The variable that is used to calculated for an indicator, consists of a key (the variable identified) and a value (the numerical value)</p>
Super-classes |[owl:Thing](http://www.w3.org/2002/07/owl#Thing) (c)<br />
Restrictions |[grit:hasUnit](https://greeninfratwins.com/ns/grit#hasUnit) (op) **exactly** 1 [http://qudt.org/schema/qudt/Unit](http://qudt.org/schema/qudt/Unit) (c)<br />[grit:hasKey](https://greeninfratwins.com/ns/grit#hasKey) (dp) **exactly** 1<br />[grit:hasValue](https://greeninfratwins.com/ns/grit#hasValue) (dp) **exactly** 1<br />[grit:mapsToLbdProperty](https://greeninfratwins.com/ns/grit#mapsToLbdProperty) (op) **exactly** 1<br />
In domain of |[grit:hasKey](https://greeninfratwins.com/ns/grit#hasKey) (dp)<br />[grit:hasUnit](https://greeninfratwins.com/ns/grit#hasUnit) (op)<br />[grit:hasValue](https://greeninfratwins.com/ns/grit#hasValue) (dp)<br />[grit:mapsToLbdProperty](https://greeninfratwins.com/ns/grit#mapsToLbdProperty) (op)<br />
In range of |[grit:hasVariable](https://greeninfratwins.com/ns/grit#hasVariable) (op)<br />
### Measure
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#Measure`
Description | <p>The definition of a measure.</p>
Super-classes |[owl:Thing](http://www.w3.org/2002/07/owl#Thing) (c)<br />
Restrictions |[grit:hasMeasureVariant](https://greeninfratwins.com/ns/grit#hasMeasureVariant) (op) **some** [grit:MeasureVariant](https://greeninfratwins.com/ns/grit#MeasureVariant) (c)<br />[grit:involvesActivities](https://greeninfratwins.com/ns/grit#involvesActivities) (op) **some** [grit:Activity](https://greeninfratwins.com/ns/grit#Activity) (c)<br />
In domain of |[grit:frequencyPerYear](https://greeninfratwins.com/ns/grit#frequencyPerYear) (dp)<br />[grit:involvesActivities](https://greeninfratwins.com/ns/grit#involvesActivities) (op)<br />[grit:hasMeasureVariant](https://greeninfratwins.com/ns/grit#hasMeasureVariant) (op)<br />
In range of |[grit:hasMeasure](https://greeninfratwins.com/ns/grit#hasMeasure) (op)<br />
### Measure indicator
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#MeasureIndicator`
Description | <p>An indicator used for being calculated in a measure for sustainability assessment.</p>
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
### Predefined indicator set
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#PredefinedIndicatorSet`
Super-classes |[grit:IndicatorSet](https://greeninfratwins.com/ns/grit#IndicatorSet) (c)<br />
In range of |[grit:hasPredefinedIndicatorSet](https://greeninfratwins.com/ns/grit#hasPredefinedIndicatorSet) (op)<br />
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
Restrictions |[grit:hasIndicatorResult](https://greeninfratwins.com/ns/grit#hasIndicatorResult) (dp) **exactly** 1<br />[grit:hasVariable](https://greeninfratwins.com/ns/grit#hasVariable) (op) **some** [grit:IndicatorVariable](https://greeninfratwins.com/ns/grit#IndicatorVariable) (c)<br />[grit:hasExternalCalculationServiceUrl](https://greeninfratwins.com/ns/grit#hasExternalCalculationServiceUrl) (op) **exactly** 1<br />[grit:calculatesForAsset](https://greeninfratwins.com/ns/grit#calculatesForAsset) (op) **some** [grit:AssetUtilization](https://greeninfratwins.com/ns/grit#AssetUtilization) (c)<br />[grit:hasUnit](https://greeninfratwins.com/ns/grit#hasUnit) (op) **exactly** 1 [http://qudt.org/schema/qudt/Unit](http://qudt.org/schema/qudt/Unit) (c)<br />
In domain of |[grit:hasExternalCalculationServiceUrl](https://greeninfratwins.com/ns/grit#hasExternalCalculationServiceUrl) (op)<br />[grit:hasFormula](https://greeninfratwins.com/ns/grit#hasFormula) (dp)<br />[grit:hasIndicatorResult](https://greeninfratwins.com/ns/grit#hasIndicatorResult) (dp)<br />[grit:hasVariable](https://greeninfratwins.com/ns/grit#hasVariable) (op)<br />
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
Restrictions |[grit:hasUnit](https://greeninfratwins.com/ns/grit#hasUnit) (op) **exactly** 1 [http://qudt.org/schema/qudt/Unit](http://qudt.org/schema/qudt/Unit) (c)<br />[grit:hasIndicatorResult](https://greeninfratwins.com/ns/grit#hasIndicatorResult) (dp) **exactly** 1<br />
Sub-classes |[grit:SimpleComputedValueIndicator](https://greeninfratwins.com/ns/grit#SimpleComputedValueIndicator) (c)<br />[grit:ComplexComputedValueIndicator](https://greeninfratwins.com/ns/grit#ComplexComputedValueIndicator) (c)<br />[grit:ConstantValueIndicator](https://greeninfratwins.com/ns/grit#ConstantValueIndicator) (c)<br />
In domain of |[grit:calculatesForAsset](https://greeninfratwins.com/ns/grit#calculatesForAsset) (op)<br />[grit:hasIndicatorResult](https://greeninfratwins.com/ns/grit#hasIndicatorResult) (dp)<br />
### Person
Property | Value
--- | ---
IRI | `https://schema.org/Person`

## Object Properties
[after activity](#afteractivity),
[belongs to predefined set of indicators](#belongstopredefinedsetofindicators),
[calculates for asset](#calculatesforasset),
[connected services](#connectedservices),
[has assessment](#hasassessment),
[has asset](#hasasset),
[has asset utilization](#hasassetutilization),
[has external calculation application](#hasexternalcalculationapplication),
[has calculation service](#hascalculationservice),
[has indicator](#hasindicator),
[has indicator set](#hasindicatorset),
[has indicator type](#hasindicatortype),
[has measure](#hasmeasure),
[has measure variant](#hasmeasurevariant),
[has indicator set](#hasPredefinedIndicatorSet),
[has unit](#hasunit),
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
[](belongstopredefinedsetofindicators)
### belongs to predefined set of indicators
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#belongsToPredefinedSetOfIndicators`
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType) (c)<br />
Range(s) |[grit:IndicatorSet](https://greeninfratwins.com/ns/grit#IndicatorSet) (c)<br />
[](calculatesforasset)
### calculates for asset
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#calculatesForAsset`
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:ValueIndicator](https://greeninfratwins.com/ns/grit#ValueIndicator) (c)<br />
Range(s) |[grit:AssetUtilization](https://greeninfratwins.com/ns/grit#AssetUtilization) (c)<br />
[](connectedservices)
### connected services
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#connectedServices`
Description | The services connected to a DT, e.g., ICDD container.
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:GreenInfraTwin](https://greeninfratwins.com/ns/grit#GreenInfraTwin) (c)<br />
[](hasassessment)
### has assessment
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasAssessment`
Description | The connection beween the DT and the use case / assessment.
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:GreenInfraTwin](https://greeninfratwins.com/ns/grit#GreenInfraTwin) (c)<br />
Range(s) |[grit:Assessment](https://greeninfratwins.com/ns/grit#Assessment) (c)<br />
[](hasasset)
### has asset
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasAsset`
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:AssetUtilization](https://greeninfratwins.com/ns/grit#AssetUtilization) (c)<br />
Range(s) |[grit:Asset](https://greeninfratwins.com/ns/grit#Asset) (c)<br />
[](hasassetutilization)
### has asset utilization
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasAssetUtilization`
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:Activity](https://greeninfratwins.com/ns/grit#Activity) (c)<br />
Range(s) |[grit:AssetUtilization](https://greeninfratwins.com/ns/grit#AssetUtilization) (c)<br />
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
[](hasPredefinedIndicatorSet)
### has indicator set
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasPredefinedIndicatorSet`
Description | Establishes the connection between the indicator set and the the predefined indicator set.
Super-properties |[owl:topObjectProperty](http://www.w3.org/2002/07/owl#topObjectProperty)<br />
Domain(s) |[grit:IndicatorSet](https://greeninfratwins.com/ns/grit#IndicatorSet) (c)<br />
Range(s) |[grit:PredefinedIndicatorSet](https://greeninfratwins.com/ns/grit#PredefinedIndicatorSet) (c)<br />
[](hasunit)
### has unit
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasUnit`
Description | The unit that a value refers to.
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
Domain(s) |[grit:Measure](https://greeninfratwins.com/ns/grit#Measure) (c)<br />[grit:MeasureVariant](https://greeninfratwins.com/ns/grit#MeasureVariant) (c)<br />
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
[executed at date](#executedatdate),
[frequency per year](#frequencyperyear),
[has country code](#hascountrycode),
[has formula](#hasformula),
[has icdd container ID](#hasicddcontainerID),
[has icdd model id](#hasicddmodelid),
[has icdd project ID](#hasicddprojectID),
[has ifc guid](#hasifcguid),
[hasIndicatorID](#hasIndicatorID),
[has indicator result](#hasindicatorresult),
[has key](#haskey),
[has value](#hasvalue),
[operation time in hours](#operationtimeinhours),
[](executedatdate)
### executed at date
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#executedAtDate`
Description | The date at which an activity is executed.
Super-properties |[owl:topDataProperty](http://www.w3.org/2002/07/owl#topDataProperty)<br />
Domain(s) |[grit:Activity](https://greeninfratwins.com/ns/grit#Activity) (c)<br />
Range(s) |[xsd:dateTime](http://www.w3.org/2001/XMLSchema#dateTime) (c)<br />
[](frequencyperyear)
### frequency per year
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#frequencyPerYear`
Description | Displays the frequency of a measure per year.
Super-properties |[owl:topDataProperty](http://www.w3.org/2002/07/owl#topDataProperty)<br />
Domain(s) |[grit:Measure](https://greeninfratwins.com/ns/grit#Measure) (c)<br />
[](hascountrycode)
### has country code
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasCountryCode`
Super-properties |[owl:topDataProperty](http://www.w3.org/2002/07/owl#topDataProperty)<br />
Domain(s) |[grit:GreenInfraTwin](https://greeninfratwins.com/ns/grit#GreenInfraTwin) (c)<br />
Range(s) |[xsd:string](http://www.w3.org/2001/XMLSchema#string) (c)<br />
[](hasformula)
### has formula
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasFormula`
Description | The calculation formula of a simple computed value indicator.
Super-properties |[owl:topDataProperty](http://www.w3.org/2002/07/owl#topDataProperty)<br />
Domain(s) |[grit:SimpleComputedValueIndicator](https://greeninfratwins.com/ns/grit#SimpleComputedValueIndicator) (c)<br />
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
[](hasindicatorresult)
### has indicator result
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasIndicatorResult`
Description | The calculated or retrieved result of an indicator.
Super-properties |[owl:topDataProperty](http://www.w3.org/2002/07/owl#topDataProperty)<br />
Domain(s) |[grit:SimpleComputedValueIndicator](https://greeninfratwins.com/ns/grit#SimpleComputedValueIndicator) (c)<br />[grit:ValueIndicator](https://greeninfratwins.com/ns/grit#ValueIndicator) (c)<br />
[](haskey)
### has key
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasKey`
Description | The key of a variable exactly as it appears in the calculation formula, e.g. v (for volume).
Super-properties |[owl:topDataProperty](http://www.w3.org/2002/07/owl#topDataProperty)<br />
Domain(s) |[grit:IndicatorVariable](https://greeninfratwins.com/ns/grit#IndicatorVariable) (c)<br />
[](hasvalue)
### has value
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#hasValue`
Description | The value that should be computed by a calculation service for a given variable.
Super-properties |[owl:topDataProperty](http://www.w3.org/2002/07/owl#topDataProperty)<br />
Domain(s) |[grit:IndicatorVariable](https://greeninfratwins.com/ns/grit#IndicatorVariable) (c)<br />
[](operationtimeinhours)
### operation time in hours
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#operationTimeInHours`
Super-properties |[owl:topDataProperty](http://www.w3.org/2002/07/owl#topDataProperty)<br />
Domain(s) |[grit:AssetUtilization](https://greeninfratwins.com/ns/grit#AssetUtilization) (c)<br />
Range(s) |[xsd:decimal](http://www.w3.org/2001/XMLSchema#decimal) (c)<br />

## Annotation Properties
[contributor](#contributor),
[created](#created),
[creator](#creator),
[description](#description),
[license](#license),
[modified](#modified),
[rights](#rights),
[source](#source),
[title](#title),
[preferredNamespacePrefix](#preferredNamespacePrefix),
[preferredNamespaceUri](#preferredNamespaceUri),
[qualifiedCardinality](#qualifiedCardinality),
[email](#email),
[identifier](#identifier),
[memberOf](#memberOf),
[name](#name),
[](contributor)
### contributor
Property | Value
--- | ---
IRI | `http://purl.org/dc/terms/contributor`
[](created)
### created
Property | Value
--- | ---
IRI | `http://purl.org/dc/terms/created`
[](creator)
### creator
Property | Value
--- | ---
IRI | `http://purl.org/dc/terms/creator`
[](description)
### description
Property | Value
--- | ---
IRI | `http://purl.org/dc/terms/description`
[](license)
### license
Property | Value
--- | ---
IRI | `http://purl.org/dc/terms/license`
[](modified)
### modified
Property | Value
--- | ---
IRI | `http://purl.org/dc/terms/modified`
[](rights)
### rights
Property | Value
--- | ---
IRI | `http://purl.org/dc/terms/rights`
[](source)
### source
Property | Value
--- | ---
IRI | `http://purl.org/dc/terms/source`
[](title)
### title
Property | Value
--- | ---
IRI | `http://purl.org/dc/terms/title`
[](preferredNamespacePrefix)
### preferredNamespacePrefix
Property | Value
--- | ---
IRI | `http://purl.org/vocab/vann/preferredNamespacePrefix`
[](preferredNamespaceUri)
### preferredNamespaceUri
Property | Value
--- | ---
IRI | `http://purl.org/vocab/vann/preferredNamespaceUri`
[](qualifiedCardinality)
### qualifiedCardinality
Property | Value
--- | ---
IRI | `http://www.w3.org/2002/07/owl#qualifiedCardinality`
[](email)
### email
Property | Value
--- | ---
IRI | `https://schema.org/email`
[](identifier)
### identifier
Property | Value
--- | ---
IRI | `https://schema.org/identifier`
[](memberOf)
### memberOf
Property | Value
--- | ---
IRI | `https://schema.org/memberOf`
[](name)
### name
Property | Value
--- | ---
IRI | `https://schema.org/name`

## Named Individuals
[Anzahl an Unf�llen/Unfallrate im Normalbetrieb (bezogen auf den Zustand)](#AnzahlanUnfllen/UnfallrateimNormalbetrieb(bezogenaufdenZustand)),
[Arbeitssicherheit (Anzahl an Unf�llen / Unfallrate im Baustellenbereich)](#Arbeitssicherheit(AnzahlanUnfllen/UnfallrateimBaustellenbereich)),
[Awf 1](#Awf1),
[Awf 2](#Awf2),
[Awf 3](#Awf3),
[Awf 4](#Awf4),
[Bauwerksbezogene Kosten](#BauwerksbezogeneKosten),
[Bauwerksbezogene Lebenszykluskosten](#BauwerksbezogeneLebenszykluskosten),
[Demontagef�higkeit](#Demontagefhigkeit),
[Emissionsbelastung der Baustellenmitarbeitenden](#EmissionsbelastungderBaustellenmitarbeitenden),
[Eutrophierungspotential (EP)](#Eutrophierungspotential(EP)),
[Externe Kosten (monetarisierte externe Effekte)](#ExterneKosten(monetarisierteexterneEffekte)),
[Externe Umwelteffekte](#ExterneUmwelteffekte),
[Fl�che des �kologisch gest�rten Lebensraums durch L�rmbeeintr�chtigung der Fauna](#FlchedeskologischgestrtenLebensraumsdurchLrmbeeintrchtigungderFauna),
[Fl�cheninanspruchnahme](#Flcheninanspruchnahme),
[Fl�cheninanspruchnahme (gesamt)](#Flcheninanspruchnahme(gesamt)),
[Fl�cheninanspruchnahme Bauprozesse (vor�bergehend)](#FlcheninanspruchnahmeBauprozesse(vorbergehend)),
[Fl�cheninanspruchnahme Bauwerk (dauerhaft)](#FlcheninanspruchnahmeBauwerk(dauerhaft)),
[Globales Erw�rmungspotential (GWP)](#GlobalesErwrmungspotential(GWP)),
[Kosten aufgrund von Zeitverlusten, Umleitungen und erh�hten Fahrzeugbetriebskosten ](#KostenaufgrundvonZeitverlusten,UmleitungenunderhhtenFahrzeugbetriebskosten),
[Kreislaufwirtschaft / Ressourcen](#Kreislaufwirtschaft/Ressourcen),
[Kumulierter Energieaufwand (KEA)](#KumulierterEnergieaufwand(KEA)),
[L�rmbeeintr�chtigung von Menschen (Anzahl vom L�rm betroffene Personen)](#LrmbeeintrchtigungvonMenschen(AnzahlvomLrmbetroffenePersonen)),
[L�rmbeeintr�chtigung von Menschen (L�rmpegel / Anzahl vom L�rm betroffene Personen)](#LrmbeeintrchtigungvonMenschen(Lrmpegel/AnzahlvomLrmbetroffenePersonen)),
[L�rmbeeintr�chtigung von Menschen (gesamt)](#LrmbeeintrchtigungvonMenschen(gesamt)),
[Materialit�t des Bauwerks](#MaterialittdesBauwerks),
[Materialkosten](#Materialkosten),
[Materlaverwertung - Potentiale Kreislauff�higkeit](#Materlaverwertung-PotentialeKreislauffhigkeit),
[Monet�rer Materialwert](#MonetrerMaterialwert),
[Nutzersicherheit](#Nutzersicherheit),
[Ozonbildungspotential (POCP)](#Ozonbildungspotential(POCP)),
[Ozonschichtabbaupotential (ODP)](#Ozonschichtabbaupotential(ODP)),
[Prozessbezogene Kosten (Planungs-, Baukosten, Kosten Nutzungsphase etc.)](#ProzessbezogeneKosten(Planungs-,Baukosten,KostenNutzungsphaseetc.)),
[Reduktion der zeitbezogenen Kapazit�t (Zeitverluste der Reisezeit; Ver�nderung Zuverl�ssigkeit der Reisezeit)](#ReduktionderzeitbezogenenKapazitt(ZeitverlustederReisezeit;VernderungZuverlssigkeitderReisezeit)),
[Risiken f�r die lokale Umwelt](#RisikenfrdielokaleUmwelt),
[Schad- und Risikostoffe](#Schad-undRisikostoffe),
[Schutzgut Mensch](#SchutzgutMensch),
[Sozio-kulturelle und funktionale Qualit�t](#Sozio-kulturelleundfunktionaleQualitt),
[Technische Qualit�t](#TechnischeQualitt),
[Verf�gbarkeit](#Verfgbarkeit),
[Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeintr�chtigungen (CO2)](#VerkehrsbedingteEmissioneninfolgebetrieblicherundbaubedingterVerkehrsbeeintrchtigungen(CO2)),
[Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeintr�chtigungen (NOx)](#VerkehrsbedingteEmissioneninfolgebetrieblicherundbaubedingterVerkehrsbeeintrchtigungen(NOx)),
[Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeintr�chtigungen (PM10)](#VerkehrsbedingteEmissioneninfolgebetrieblicherundbaubedingterVerkehrsbeeintrchtigungen(PM10)),
[Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeintr�chtigungen (PM2.5)](#VerkehrsbedingteEmissioneninfolgebetrieblicherundbaubedingterVerkehrsbeeintrchtigungen(PM2.5)),
[Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeintr�chtigungen (PM5)](#VerkehrsbedingteEmissioneninfolgebetrieblicherundbaubedingterVerkehrsbeeintrchtigungen(PM5)),
[Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeintr�chtigungen (gesamt)](#VerkehrsbedingteEmissioneninfolgebetrieblicherundbaubedingterVerkehrsbeeintrchtigungen(gesamt)),
[Versauerungspotential (AP)](#Versauerungspotential(AP)),
[Zuverl�ssigkeit](#Zuverlssigkeit),
[Zuverl�ssigkeitsindex (beta-Wert)](#Zuverlssigkeitsindex(beta-Wert)),
[�kobilanz](#kobilanz),
[�kologische Qualit�t](#kologischeQualitt),
[�konomische Qualit�t](#konomischeQualitt),
### Awf 1 <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#Awf_1`
* **Contributor(s)**
  * [grit:SpecifiedUseCase](https://greeninfratwins.com/ns/grit#SpecifiedUseCase)
### Awf 2 <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#Awf_2`
* **Contributor(s)**
  * [grit:SpecifiedUseCase](https://greeninfratwins.com/ns/grit#SpecifiedUseCase)
### Awf 3 <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#Awf_3`
* **Contributor(s)**
  * [grit:SpecifiedUseCase](https://greeninfratwins.com/ns/grit#SpecifiedUseCase)
### Awf 4 <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#Awf_4`
* **Contributor(s)**
  * [grit:SpecifiedUseCase](https://greeninfratwins.com/ns/grit#SpecifiedUseCase)
### Verf�gbarkeit <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_Availability`
* **Contributor(s)**
  * [grit:PredefinedIndicatorSet](https://greeninfratwins.com/ns/grit#PredefinedIndicatorSet)
### Bauwerksbezogene Lebenszykluskosten <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_BuildingRelatedLifecycleCosts`
* **Contributor(s)**
  * [grit:PredefinedIndicatorSet](https://greeninfratwins.com/ns/grit#PredefinedIndicatorSet)
### Kreislaufwirtschaft / Ressourcen <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_CircularEconomyResources`
* **Contributor(s)**
  * [grit:PredefinedIndicatorSet](https://greeninfratwins.com/ns/grit#PredefinedIndicatorSet)
### �kologische Qualit�t <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_EcologicalQuality`
* **Contributor(s)**
  * [grit:PredefinedIndicatorSet](https://greeninfratwins.com/ns/grit#PredefinedIndicatorSet)
### �konomische Qualit�t <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_EconomicQuality`
* **Contributor(s)**
  * [grit:PredefinedIndicatorSet](https://greeninfratwins.com/ns/grit#PredefinedIndicatorSet)
### Externe Umwelteffekte <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_EnvironmentalEffects`
* **Contributor(s)**
  * [grit:PredefinedIndicatorSet](https://greeninfratwins.com/ns/grit#PredefinedIndicatorSet)
### Externe Kosten (monetarisierte externe Effekte) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_ExternalCosts`
* **Contributor(s)**
  * [grit:PredefinedIndicatorSet](https://greeninfratwins.com/ns/grit#PredefinedIndicatorSet)
### Schutzgut Mensch <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_HumanProtection`
* **Contributor(s)**
  * [grit:PredefinedIndicatorSet](https://greeninfratwins.com/ns/grit#PredefinedIndicatorSet)
### Fl�cheninanspruchnahme <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_LandUse`
* **Contributor(s)**
  * [grit:PredefinedIndicatorSet](https://greeninfratwins.com/ns/grit#PredefinedIndicatorSet)
### �kobilanz <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_LifecycleAssessment`
* **Contributor(s)**
  * [grit:PredefinedIndicatorSet](https://greeninfratwins.com/ns/grit#PredefinedIndicatorSet)
### Risiken f�r die lokale Umwelt <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_LocalEnvironmentalRisks`
* **Contributor(s)**
  * [grit:PredefinedIndicatorSet](https://greeninfratwins.com/ns/grit#PredefinedIndicatorSet)
### Zuverl�ssigkeit <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_Reliability`
* **Contributor(s)**
  * [grit:PredefinedIndicatorSet](https://greeninfratwins.com/ns/grit#PredefinedIndicatorSet)
### Nutzersicherheit <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_Safety`
* **Contributor(s)**
  * [grit:PredefinedIndicatorSet](https://greeninfratwins.com/ns/grit#PredefinedIndicatorSet)
### Sozio-kulturelle und funktionale Qualit�t <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_SocioCulturalQuality`
* **Contributor(s)**
  * [grit:PredefinedIndicatorSet](https://greeninfratwins.com/ns/grit#PredefinedIndicatorSet)
### Technische Qualit�t <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorSet_Predefined_TechnicalQuality`
* **Contributor(s)**
  * [grit:PredefinedIndicatorSet](https://greeninfratwins.com/ns/grit#PredefinedIndicatorSet)
### Materialit�t des Bauwerks <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_1_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Materialit�t eines Bauwerks in Masse-Prozent
### Monet�rer Materialwert <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_1_2`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von monet�rer Materialwert in EUR
### Schad- und Risikostoffe <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_1_3`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Schad- und Risikostoffe in kg
### Demontagef�higkeit <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_1_4`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Demontagefaehigkeit mit qualitative Bewertungsergebnis
### Materlaverwertung - Potentiale Kreislauff�higkeit <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_1_5`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Materialverwertung zur potentialen Kreislauffaehigkeit in Massen-Prozent
### Fl�che des �kologisch gest�rten Lebensraums durch L�rmbeeintr�chtigung der Fauna <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_2_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition Fl�che des �kologisch gest�rten Lebensraums durch L�rmbeeintr�chtigung der Fauna in m2
### Fl�cheninanspruchnahme (gesamt) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_3_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Fl�cheninanspruchnahme Bauwerk (dauerhaft) und Bauprozesse (vor�bergehend) in gewichtete m2
### Fl�cheninanspruchnahme Bauwerk (dauerhaft) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_3_1_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Fl�cheninanspruchnahme Bauwerk (dauerhaft)  in gewichtete m2
### Fl�cheninanspruchnahme Bauprozesse (vor�bergehend) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_3_1_2`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Fl�cheninanspruchnahme Bauprozesse (vor�bergehend) in gewichtete m2
### Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeintr�chtigungen (gesamt) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_4_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeintr�chtigungen in Masse
### Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeintr�chtigungen (CO2) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_4_1_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeintr�chtigungen in Masse
### Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeintr�chtigungen (NOx) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_4_1_2`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeintr�chtigungen in Masse
### Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeintr�chtigungen (PM2.5) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_4_1_3`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeintr�chtigungen in Masse
### Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeintr�chtigungen (PM5) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_4_1_4`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeintr�chtigungen in Masse
### Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeintr�chtigungen (PM10) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_4_1_5`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Verkehrsbedingte Emissionen infolge betrieblicher und baubedingter Verkehrsbeeintr�chtigungen in Masse
### Globales Erw�rmungspotential (GWP) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_5_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Globales Erw�rmungspotential (GWP) in kg CO2-�quiv.
### Eutrophierungspotential (EP) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_5_2`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Eutrophierungspotential (EP) in kg PO43-�quiv.
### Ozonschichtabbaupotential (ODP) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_5_3`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Ozonschichtabbaupotential (ODP) in kg R11-�quiv.
### Versauerungspotential (AP) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_5_4`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Versauerungspotential (AP) in kg SO2-�quiv.
### Ozonbildungspotential (POCP) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_5_5`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Ozonbildungspotential (POCP) in kg C2H4-�quiv.
### Kumulierter Energieaufwand (KEA) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_1_5_6`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Kumulierter Energieaufwand (KEA) in MJ
### Bauwerksbezogene Kosten <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_2_1_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Materialkosten, prozessbezogene Kosten (Planungs-, Baukosten, Kosten Nutzungsphase etc.) in EUR
### Materialkosten <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_2_1_1_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Materialkosten - Teilkosten von Material-, prozessbezogene Kosten (Planungs-, Baukosten, Kosten Nutzungsphase etc.) in EUR
### Prozessbezogene Kosten (Planungs-, Baukosten, Kosten Nutzungsphase etc.) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_2_1_1_2`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Prozessbezogenekosten, Teilkosten von Material-, prozessbezogene Kosten (Planungs-, Baukosten, Kosten Nutzungsphase etc.) in EUR
### Kosten aufgrund von Zeitverlusten, Umleitungen und erh�hten Fahrzeugbetriebskosten  <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_2_2_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Kosten aufgrund von Zeitverlusten, Umleitungen und erh�hten Fahrzeugbetriebskosten in EUR
### L�rmbeeintr�chtigung von Menschen (gesamt) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_3_1_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von L�rmbeeintr�chtigung von Menschen (Laermpegel / Anzahl vom L�rm betroffene Personen)
### L�rmbeeintr�chtigung von Menschen (L�rmpegel / Anzahl vom L�rm betroffene Personen) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_3_1_1_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von L�rmbeeintr�chtigung von Menschen (L�rmpegel / Anzahl vom L�rm betroffene Personen) in db/pax
### L�rmbeeintr�chtigung von Menschen (Anzahl vom L�rm betroffene Personen) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_3_1_1_2`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von L�rmbeeintr�chtigung von Menschen (Anzahl vom L�rm betroffene Personen) in Konzentration Schadstoffe
### Emissionsbelastung der Baustellenmitarbeitenden <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_3_1_2`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r die Definition der Emissionsbelastung der Baustellenmitarbeitenden und Auswirkung auf die Gesundheit [ppm]
### Arbeitssicherheit (Anzahl an Unf�llen / Unfallrate im Baustellenbereich) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_3_1_3`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Arbeitssicherheit (Anzahl an Unf�llen / Unfallrate im Baustellenbereich) in pax / -
### Reduktion der zeitbezogenen Kapazit�t (Zeitverluste der Reisezeit; Ver�nderung Zuverl�ssigkeit der Reisezeit) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_3_2_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Reduktion der zeitbezogenen Kapazit�t (Zeitverluste der Reisezeit; Ver�nderung Zuverl�ssigkeit der Reisezeit) in %
### Zuverl�ssigkeitsindex (beta-Wert) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_4_1_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Zuverl�ssigkeitsindex (beta-Wert)
### Anzahl an Unf�llen/Unfallrate im Normalbetrieb (bezogen auf den Zustand) <sup>c</sup>
Property | Value
--- | ---
IRI | `https://greeninfratwins.com/ns/grit#IndicatorType_4_2_1`
* **Contributor(s)**
  * [grit:IndicatorType](https://greeninfratwins.com/ns/grit#IndicatorType)
Description | Indikator f�r Definition von Anzahl an Unf�llen/Unfallrate im Normalbetrieb (bezogen auf den Zustand)
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