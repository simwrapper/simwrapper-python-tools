import{d as E,g as T,n as $}from"./index-DRfMX6UN.js";import{E as b,M as P,X as O}from"./XMLParser-Csz3XWGK.js";import{Y as _}from"./index-Dq6huqCM.js";const V=`
`;function D(e,t){let n="";t.format&&t.indentBy.length>0&&(n=V);const r=[];if(t.stopNodes&&Array.isArray(t.stopNodes))for(let i=0;i<t.stopNodes.length;i++){const l=t.stopNodes[i];typeof l=="string"?r.push(new b(l)):l instanceof b&&r.push(l)}const a=new P;return A(e,t,n,a,r)}function A(e,t,n,r,a){let i="",l=!1;if(t.maxNestedTags&&r.getDepth()>t.maxNestedTags)throw new Error("Maximum nested tags exceeded");if(!Array.isArray(e)){if(e!=null){let s=e.toString();return s=x(s,t),s}return""}for(let s=0;s<e.length;s++){const u=e[s],o=S(u);if(o===void 0)continue;const m=F(u[":@"],t);r.push(o,m);const g=G(r,a);if(o===t.textNodeName){let d=u[o];g||(d=t.tagValueProcessor(o,d),d=x(d,t)),l&&(i+=n),i+=d,l=!1,r.pop();continue}else if(o===t.cdataPropName){l&&(i+=n);const d=u[o][0][t.textNodeName],y=String(d).replace(/\]\]>/g,"]]]]><![CDATA[>");i+=`<![CDATA[${y}]]>`,l=!1,r.pop();continue}else if(o===t.commentPropName){const d=u[o][0][t.textNodeName],y=String(d).replace(/--/g,"- -").replace(/-$/,"- ");i+=n+`<!--${y}-->`,l=!0,r.pop();continue}else if(o[0]==="?"){const d=w(u[":@"],t,g),y=o==="?xml"?"":n;let N=u[o][0][t.textNodeName];N=N.length!==0?" "+N:"",i+=y+`<${o}${N}${d}?>`,l=!0,r.pop();continue}let p=n;p!==""&&(p+=t.indentBy);const h=w(u[":@"],t,g),v=n+`<${o}${h}`;let c;g?c=C(u[o],t):c=A(u[o],t,p,r,a),t.unpairedTags.indexOf(o)!==-1?t.suppressUnpairedNode?i+=v+">":i+=v+"/>":(!c||c.length===0)&&t.suppressEmptyNode?i+=v+"/>":c&&c.endsWith(">")?i+=v+`>${c}${n}</${o}>`:(i+=v+">",c&&n!==""&&(c.includes("/>")||c.includes("</"))?i+=n+t.indentBy+c+n:i+=c,i+=`</${o}>`),l=!0,r.pop()}return i}function F(e,t){if(!e||t.ignoreAttributes)return null;const n={};let r=!1;for(let a in e){if(!Object.prototype.hasOwnProperty.call(e,a))continue;const i=a.startsWith(t.attributeNamePrefix)?a.substr(t.attributeNamePrefix.length):a;n[i]=e[a],r=!0}return r?n:null}function C(e,t){if(!Array.isArray(e))return e!=null?e.toString():"";let n="";for(let r=0;r<e.length;r++){const a=e[r],i=S(a);if(i===t.textNodeName)n+=a[i];else if(i===t.cdataPropName)n+=a[i][0][t.textNodeName];else if(i===t.commentPropName)n+=a[i][0][t.textNodeName];else{if(i&&i[0]==="?")continue;if(i){const l=R(a[":@"],t),s=C(a[i],t);!s||s.length===0?n+=`<${i}${l}/>`:n+=`<${i}${l}>${s}</${i}>`}}}return n}function R(e,t){let n="";if(e&&!t.ignoreAttributes)for(let r in e){if(!Object.prototype.hasOwnProperty.call(e,r))continue;let a=e[r];a===!0&&t.suppressBooleanAttributes?n+=` ${r.substr(t.attributeNamePrefix.length)}`:n+=` ${r.substr(t.attributeNamePrefix.length)}="${a}"`}return n}function S(e){const t=Object.keys(e);for(let n=0;n<t.length;n++){const r=t[n];if(Object.prototype.hasOwnProperty.call(e,r)&&r!==":@")return r}}function w(e,t,n){let r="";if(e&&!t.ignoreAttributes)for(let a in e){if(!Object.prototype.hasOwnProperty.call(e,a))continue;let i;n?i=e[a]:(i=t.attributeValueProcessor(a,e[a]),i=x(i,t)),i===!0&&t.suppressBooleanAttributes?r+=` ${a.substr(t.attributeNamePrefix.length)}`:r+=` ${a.substr(t.attributeNamePrefix.length)}="${i}"`}return r}function G(e,t){if(!t||t.length===0)return!1;for(let n=0;n<t.length;n++)if(e.matches(t[n]))return!0;return!1}function x(e,t){if(e&&e.length>0&&t.processEntities)for(let n=0;n<t.entities.length;n++){const r=t.entities[n];e=e.replace(r.regex,r.val)}return e}function k(e){return typeof e=="function"?e:Array.isArray(e)?t=>{for(const n of e)if(typeof n=="string"&&t===n||n instanceof RegExp&&n.test(t))return!0}:()=>!1}const M={attributeNamePrefix:"@_",attributesGroupName:!1,textNodeName:"#text",ignoreAttributes:!0,cdataPropName:!1,format:!1,indentBy:"  ",suppressEmptyNode:!1,suppressUnpairedNode:!0,suppressBooleanAttributes:!0,tagValueProcessor:function(e,t){return t},attributeValueProcessor:function(e,t){return t},preserveOrder:!1,commentPropName:!1,unpairedTags:[],entities:[{regex:new RegExp("&","g"),val:"&amp;"},{regex:new RegExp(">","g"),val:"&gt;"},{regex:new RegExp("<","g"),val:"&lt;"},{regex:new RegExp("'","g"),val:"&apos;"},{regex:new RegExp('"',"g"),val:"&quot;"}],processEntities:!0,stopNodes:[],oneListGroup:!1,maxNestedTags:100,jPath:!0};function f(e){if(this.options=Object.assign({},M,e),this.options.stopNodes&&Array.isArray(this.options.stopNodes)&&(this.options.stopNodes=this.options.stopNodes.map(t=>typeof t=="string"&&t.startsWith("*.")?".."+t.substring(2):t)),this.stopNodeExpressions=[],this.options.stopNodes&&Array.isArray(this.options.stopNodes))for(let t=0;t<this.options.stopNodes.length;t++){const n=this.options.stopNodes[t];typeof n=="string"?this.stopNodeExpressions.push(new b(n)):n instanceof b&&this.stopNodeExpressions.push(n)}this.options.ignoreAttributes===!0||this.options.attributesGroupName?this.isAttribute=function(){return!1}:(this.ignoreAttributesFn=k(this.options.ignoreAttributes),this.attrPrefixLen=this.options.attributeNamePrefix.length,this.isAttribute=I),this.processTextOrObjNode=B,this.options.format?(this.indentate=L,this.tagEndChar=`>
`,this.newLine=`
`):(this.indentate=function(){return""},this.tagEndChar=">",this.newLine="")}f.prototype.build=function(e){if(this.options.preserveOrder)return D(e,this.options);{Array.isArray(e)&&this.options.arrayNodeName&&this.options.arrayNodeName.length>1&&(e={[this.options.arrayNodeName]:e});const t=new P;return this.j2x(e,0,t).val}};f.prototype.j2x=function(e,t,n){let r="",a="";if(this.options.maxNestedTags&&n.getDepth()>=this.options.maxNestedTags)throw new Error("Maximum nested tags exceeded");const i=this.options.jPath?n.toString():n,l=this.checkStopNode(n);for(let s in e)if(Object.prototype.hasOwnProperty.call(e,s))if(typeof e[s]>"u")this.isAttribute(s)&&(a+="");else if(e[s]===null)this.isAttribute(s)||s===this.options.cdataPropName?a+="":s[0]==="?"?a+=this.indentate(t)+"<"+s+"?"+this.tagEndChar:a+=this.indentate(t)+"<"+s+"/"+this.tagEndChar;else if(e[s]instanceof Date)a+=this.buildTextValNode(e[s],s,"",t,n);else if(typeof e[s]!="object"){const u=this.isAttribute(s);if(u&&!this.ignoreAttributesFn(u,i))r+=this.buildAttrPairStr(u,""+e[s],l);else if(!u)if(s===this.options.textNodeName){let o=this.options.tagValueProcessor(s,""+e[s]);a+=this.replaceEntitiesValue(o)}else{n.push(s);const o=this.checkStopNode(n);if(n.pop(),o){const m=""+e[s];m===""?a+=this.indentate(t)+"<"+s+this.closeTag(s)+this.tagEndChar:a+=this.indentate(t)+"<"+s+">"+m+"</"+s+this.tagEndChar}else a+=this.buildTextValNode(e[s],s,"",t,n)}}else if(Array.isArray(e[s])){const u=e[s].length;let o="",m="";for(let g=0;g<u;g++){const p=e[s][g];if(!(typeof p>"u"))if(p===null)s[0]==="?"?a+=this.indentate(t)+"<"+s+"?"+this.tagEndChar:a+=this.indentate(t)+"<"+s+"/"+this.tagEndChar;else if(typeof p=="object")if(this.options.oneListGroup){n.push(s);const h=this.j2x(p,t+1,n);n.pop(),o+=h.val,this.options.attributesGroupName&&p.hasOwnProperty(this.options.attributesGroupName)&&(m+=h.attrStr)}else o+=this.processTextOrObjNode(p,s,t,n);else if(this.options.oneListGroup){let h=this.options.tagValueProcessor(s,p);h=this.replaceEntitiesValue(h),o+=h}else{n.push(s);const h=this.checkStopNode(n);if(n.pop(),h){const v=""+p;v===""?o+=this.indentate(t)+"<"+s+this.closeTag(s)+this.tagEndChar:o+=this.indentate(t)+"<"+s+">"+v+"</"+s+this.tagEndChar}else o+=this.buildTextValNode(p,s,"",t,n)}}this.options.oneListGroup&&(o=this.buildObjectNode(o,s,m,t)),a+=o}else if(this.options.attributesGroupName&&s===this.options.attributesGroupName){const u=Object.keys(e[s]),o=u.length;for(let m=0;m<o;m++)r+=this.buildAttrPairStr(u[m],""+e[s][u[m]],l)}else a+=this.processTextOrObjNode(e[s],s,t,n);return{attrStr:r,val:a}};f.prototype.buildAttrPairStr=function(e,t,n){return n||(t=this.options.attributeValueProcessor(e,""+t),t=this.replaceEntitiesValue(t)),this.options.suppressBooleanAttributes&&t==="true"?" "+e:" "+e+'="'+t+'"'};function B(e,t,n,r){const a=this.extractAttributes(e);if(r.push(t,a),this.checkStopNode(r)){const s=this.buildRawContent(e),u=this.buildAttributesForStopNode(e);return r.pop(),this.buildObjectNode(s,t,u,n)}const l=this.j2x(e,n+1,r);return r.pop(),e[this.options.textNodeName]!==void 0&&Object.keys(e).length===1?this.buildTextValNode(e[this.options.textNodeName],t,l.attrStr,n,r):this.buildObjectNode(l.val,t,l.attrStr,n)}f.prototype.extractAttributes=function(e){if(!e||typeof e!="object")return null;const t={};let n=!1;if(this.options.attributesGroupName&&e[this.options.attributesGroupName]){const r=e[this.options.attributesGroupName];for(let a in r){if(!Object.prototype.hasOwnProperty.call(r,a))continue;const i=a.startsWith(this.options.attributeNamePrefix)?a.substring(this.options.attributeNamePrefix.length):a;t[i]=r[a],n=!0}}else for(let r in e){if(!Object.prototype.hasOwnProperty.call(e,r))continue;const a=this.isAttribute(r);a&&(t[a]=e[r],n=!0)}return n?t:null};f.prototype.buildRawContent=function(e){if(typeof e=="string")return e;if(typeof e!="object"||e===null)return String(e);if(e[this.options.textNodeName]!==void 0)return e[this.options.textNodeName];let t="";for(let n in e){if(!Object.prototype.hasOwnProperty.call(e,n)||this.isAttribute(n)||this.options.attributesGroupName&&n===this.options.attributesGroupName)continue;const r=e[n];if(n===this.options.textNodeName)t+=r;else if(Array.isArray(r)){for(let a of r)if(typeof a=="string"||typeof a=="number")t+=`<${n}>${a}</${n}>`;else if(typeof a=="object"&&a!==null){const i=this.buildRawContent(a),l=this.buildAttributesForStopNode(a);i===""?t+=`<${n}${l}/>`:t+=`<${n}${l}>${i}</${n}>`}}else if(typeof r=="object"&&r!==null){const a=this.buildRawContent(r),i=this.buildAttributesForStopNode(r);a===""?t+=`<${n}${i}/>`:t+=`<${n}${i}>${a}</${n}>`}else t+=`<${n}>${r}</${n}>`}return t};f.prototype.buildAttributesForStopNode=function(e){if(!e||typeof e!="object")return"";let t="";if(this.options.attributesGroupName&&e[this.options.attributesGroupName]){const n=e[this.options.attributesGroupName];for(let r in n){if(!Object.prototype.hasOwnProperty.call(n,r))continue;const a=r.startsWith(this.options.attributeNamePrefix)?r.substring(this.options.attributeNamePrefix.length):r,i=n[r];i===!0&&this.options.suppressBooleanAttributes?t+=" "+a:t+=" "+a+'="'+i+'"'}}else for(let n in e){if(!Object.prototype.hasOwnProperty.call(e,n))continue;const r=this.isAttribute(n);if(r){const a=e[n];a===!0&&this.options.suppressBooleanAttributes?t+=" "+r:t+=" "+r+'="'+a+'"'}}return t};f.prototype.buildObjectNode=function(e,t,n,r){if(e==="")return t[0]==="?"?this.indentate(r)+"<"+t+n+"?"+this.tagEndChar:this.indentate(r)+"<"+t+n+this.closeTag(t)+this.tagEndChar;{let a="</"+t+this.tagEndChar,i="";return t[0]==="?"&&(i="?",a=""),(n||n==="")&&e.indexOf("<")===-1?this.indentate(r)+"<"+t+n+i+">"+e+a:this.options.commentPropName!==!1&&t===this.options.commentPropName&&i.length===0?this.indentate(r)+`<!--${e}-->`+this.newLine:this.indentate(r)+"<"+t+n+i+this.tagEndChar+e+this.indentate(r)+a}};f.prototype.closeTag=function(e){let t="";return this.options.unpairedTags.indexOf(e)!==-1?this.options.suppressUnpairedNode||(t="/"):this.options.suppressEmptyNode?t="/":t=`></${e}`,t};f.prototype.checkStopNode=function(e){if(!this.stopNodeExpressions||this.stopNodeExpressions.length===0)return!1;for(let t=0;t<this.stopNodeExpressions.length;t++)if(e.matches(this.stopNodeExpressions[t]))return!0;return!1};f.prototype.buildTextValNode=function(e,t,n,r,a){if(this.options.cdataPropName!==!1&&t===this.options.cdataPropName){const i=String(e).replace(/\]\]>/g,"]]]]><![CDATA[>");return this.indentate(r)+`<![CDATA[${i}]]>`+this.newLine}else if(this.options.commentPropName!==!1&&t===this.options.commentPropName){const i=String(e).replace(/--/g,"- -").replace(/-$/,"- ");return this.indentate(r)+`<!--${i}-->`+this.newLine}else{if(t[0]==="?")return this.indentate(r)+"<"+t+n+"?"+this.tagEndChar;{let i=this.options.tagValueProcessor(t,e);return i=this.replaceEntitiesValue(i),i===""?this.indentate(r)+"<"+t+n+this.closeTag(t)+this.tagEndChar:this.indentate(r)+"<"+t+n+">"+i+"</"+t+this.tagEndChar}}};f.prototype.replaceEntitiesValue=function(e){if(e&&e.length>0&&this.options.processEntities)for(let t=0;t<this.options.entities.length;t++){const n=this.options.entities[t];e=e.replace(n.regex,n.val)}return e};function L(e){return this.options.indentBy.repeat(e)}function I(e){return e.startsWith(this.options.attributeNamePrefix)&&e!==this.options.textNodeName?e.substr(this.attrPrefixLen):!1}const W=`# MATSim run configurator - config.xml edit fields

sections:
  - title: General settings
    entries:
      - xml: controler.param
        name: runId
        title: 'Name of the run'
        type: text
        value: ''

      - xml: controler.param
        name: lastIteration
        title: 'Number of iterations'
        type: number
        value: '1'

      - xml: controler.param
        name: writeEventsInterval
        title: 'Write events every n iterations'
        type: number
        value: '50'

      - xml: controler.param
        name: writePlansInterval
        title: 'Write plans every n iterations'
        type: number
        value: '50'
        hint: 'Set to 0 to disable writing plans'

  - title: Mobility simulation
    entries:
      - xml: qsim.param
        name: endTime
        title: 'End time'
        type: text
        value: '24:00:00'

      - xml: qsim.param
        name: flowCapacityFactor
        title: 'Flow capacity factor'
        type: number
        value: '0.10'

      - xml: qsim.param
        name: storageCapacityFactor
        title: 'Storage capacity factor'
        type: number
        value: '0.10'

      - xml: qsim.param
        name: mainMode
        title: 'Main modes'
        type: text
        value: 'car,freight'

      - xml: qsim.param
        name: stuckTime
        title: 'Stuck time (minutes)'
        type: number
        value: '30.0'

      - xml: qsim.param
        name: trafficDynamics
        title: 'Traffic Dynamics'
        type: selection
        options:
          - kinematicWaves
          - other
        value: 'kinematicWaves'
`,U=`<?xml version="1.0" encoding="UTF-8"?>\r
<!DOCTYPE config SYSTEM "http://www.matsim.org/files/dtd/config_v2.dtd">\r
<config>\r
	<module name="TimeAllocationMutator" >\r
		<param name="mutationRange" value="7200.0" />\r
	</module>\r
	<module name="controler" >\r
		<param name="lastIteration" value="250" />\r
		<param name="overwriteFiles" value="failIfDirectoryExists" />\r
		<param name="runId" value="berlin-v5.5-1pct" />\r
		<param name="outputDirectory" value="./scenarios/berlin-v5.5-1pct/output-berlin-v5.5-1pct" />\r
		<param name="writeEventsInterval" value="50" />\r
		<param name="writePlansInterval" value="50" />\r
	</module>\r
	<module name="global" >\r
		<param name="coordinateSystem" value="EPSG:31468" />\r
		<param name="insistingOnDeprecatedConfigVersion" value="false" />\r
		<param name="numberOfThreads" value="8" />\r
	</module>\r
	<module name="network" >\r
		<param name="inputNetworkFile" value="https://svn.vsp.tu-berlin.de/repos/public-svn/matsim/scenarios/countries/de/berlin/berlin-v5.5-10pct/input/berlin-v5.5-network.xml.gz" />\r
	</module>\r
	<module name="plans" >\r
		<param name="inputPlansFile" value="https://svn.vsp.tu-berlin.de/repos/public-svn/matsim/scenarios/countries/de/berlin/berlin-v5.5-1pct/input/berlin-v5.5-1pct.plans.xml.gz" />\r
		<param name="removingUnnecessaryPlanAttributes" value="true" />\r
	</module>\r
	<module name="vehicles" >\r
		<param name="vehiclesFile" value="https://svn.vsp.tu-berlin.de/repos/public-svn/matsim/scenarios/countries/de/berlin/berlin-v5.5-10pct/input/berlin-v5-mode-vehicle-types.xml" />\r
	</module>\r
	<module name="transit" >\r
		<param name="transitScheduleFile" value="https://svn.vsp.tu-berlin.de/repos/public-svn/matsim/scenarios/countries/de/berlin/berlin-v5.5-10pct/input/berlin-v5.5-transit-schedule.xml.gz" />\r
		<param name="useTransit" value="true" />\r
		<param name="vehiclesFile" value="https://svn.vsp.tu-berlin.de/repos/public-svn/matsim/scenarios/countries/de/berlin/berlin-v5.5-10pct/input/berlin-v5.5-transit-vehicles.xml.gz" />\r
	</module>\r
	<module name="planscalcroute" >\r
		<param name="networkModes" value="car,freight,ride" />\r
		<parameterset type="teleportedModeParameters" >\r
			<param name="beelineDistanceFactor" value="1.3" />\r
			<param name="mode" value="bicycle" />\r
			<param name="teleportedModeSpeed" value="3.1388889" />\r
		</parameterset>\r
		<parameterset type="teleportedModeParameters" >\r
			<param name="beelineDistanceFactor" value="1.3" />\r
			<param name="mode" value="walk" />\r
			<param name="teleportedModeSpeed" value="1.0555556" />\r
		</parameterset>\r
	</module>\r
	<module name="qsim" >\r
		<param name="endTime" value="36:00:00" />\r
		<param name="flowCapacityFactor" value="0.015" />\r
		<param name="mainMode" value="car,freight" />\r
		<param name="numberOfThreads" value="8" />\r
		<param name="startTime" value="00:00:00" />\r
		<param name="storageCapacityFactor" value="0.015" />\r
		<param name="stuckTime" value="30.0" />\r
		<param name="trafficDynamics" value="kinematicWaves" />\r
		<param name="vehiclesSource" value="modeVehicleTypesFromVehiclesData" />\r
		<param name="insertingWaitingVehiclesBeforeDrivingVehicles" value="true" />\r
	</module>\r
	<module name="strategy" >\r
		<param name="fractionOfIterationsToDisableInnovation" value="0.8" />\r
		<parameterset type="strategysettings" >\r
			<param name="strategyName" value="ChangeExpBeta" />\r
			<param name="subpopulation" value="person" />\r
			<param name="weight" value="0.85" />\r
		</parameterset>\r
		<parameterset type="strategysettings" >\r
			<param name="strategyName" value="ReRoute" />\r
			<param name="subpopulation" value="person" />\r
			<param name="weight" value="0.05" />\r
		</parameterset>\r
		<parameterset type="strategysettings" >\r
			<param name="strategyName" value="SubtourModeChoice" />\r
			<param name="subpopulation" value="person" />\r
			<param name="weight" value="0.05" />\r
		</parameterset>\r
		<parameterset type="strategysettings" >\r
			<param name="strategyName" value="TimeAllocationMutator" />\r
			<param name="subpopulation" value="person" />\r
			<param name="weight" value="0.05" />\r
		</parameterset>\r
		<parameterset type="strategysettings" >\r
			<param name="strategyName" value="ChangeExpBeta" />\r
			<param name="subpopulation" value="freight" />\r
			<param name="weight" value="0.95" />\r
		</parameterset>\r
		<parameterset type="strategysettings" >\r
			<param name="strategyName" value="ReRoute" />\r
			<param name="subpopulation" value="freight" />\r
			<param name="weight" value="0.05" />\r
		</parameterset>\r
	</module>\r
	<module name="subtourModeChoice" >\r
		<param name="chainBasedModes" value="car,bicycle" />\r
		<param name="modes" value="car,pt,bicycle,walk" />\r
	</module>\r
	<module name="transitRouter" >\r
		<param name="extensionRadius" value="500.0" />\r
	</module>\r
	<module name="travelTimeCalculator" >\r
		<param name="analyzedModes" value="car,freight" />\r
		<param name="separateModes" value="true" />\r
	</module>\r
	<module name="vspExperimental" >\r
		<param name="vspDefaultsCheckingLevel" value="abort" />\r
	</module>\r
	<module name="planCalcScore" >\r
		<param name="fractionOfIterationsToStartScoreMSA" value="1.0" />\r
		<parameterset type="scoringParameters" >\r
			<param name="marginalUtilityOfMoney" value="0.6" />\r
			<parameterset type="modeParams" >\r
				<!--set this to -0.9 during income calibration process-->\r
				<param name="constant" value="-1.0" />\r
				<param name="marginalUtilityOfTraveling_util_hr" value="0.0" />\r
				<param name="mode" value="car" />\r
				<param name="monetaryDistanceRate" value="-0.0002" />\r
				<param name="dailyMonetaryConstant" value="-5.3" />\r
			</parameterset>\r
			<parameterset type="modeParams" >\r
				<param name="constant" value="-0.0" />\r
				<param name="marginalUtilityOfTraveling_util_hr" value="0.0" />\r
				<param name="mode" value="ride" />\r
				<param name="monetaryDistanceRate" value="-0.0002" />\r
				<param name="dailyMonetaryConstant" value="-0.0" />\r
			</parameterset>\r
			<parameterset type="modeParams" >\r
				<param name="marginalUtilityOfTraveling_util_hr" value="0.0" />\r
				<param name="mode" value="freight" />\r
				<param name="monetaryDistanceRate" value="-0.0004" />\r
			</parameterset>\r
			<parameterset type="modeParams" >\r
				<param name="constant" value="-0.3" />\r
				<param name="marginalUtilityOfTraveling_util_hr" value="0.0" />\r
				<param name="mode" value="pt" />\r
				<param name="dailyMonetaryConstant" value="-2.1" />\r
			</parameterset>\r
			<parameterset type="modeParams" >\r
				<param name="constant" value="-1.8" />\r
				<param name="marginalUtilityOfTraveling_util_hr" value="0.0" />\r
				<param name="mode" value="bicycle" />\r
			</parameterset>\r
			<parameterset type="modeParams" >\r
				<param name="marginalUtilityOfTraveling_util_hr" value="0.0" />\r
				<param name="mode" value="walk" />\r
			</parameterset>\r
		</parameterset>\r
	</module>\r
\r
	<module name="transitRouter">\r
		<!-- Factor with which direct walk generalized cost is multiplied before it is compared to the pt generalized cost.  Set to a very high value to reduce direct walk results. -->\r
		<param name="directWalkFactor" value="1.0" />\r
		<!-- maximum beeline distance between stops that agents could transfer to by walking -->\r
		<param name="maxBeelineWalkConnectionDistance" value="300.0" />\r
	</module>\r
</config>\r
`,q={messages:{en:{},de:{}}},z=E({name:"RunConfigurator",components:{},i18n:q,props:{id:{type:String,required:!0},model:{type:String,required:!1},xml:{type:Object,required:!1}},data:()=>({globalState:T.state,sections:[],activeSection:-1,xmlConfig:{}}),mounted(){this.$store.commit("setShowLeftBar",!0);const e=_.parse(W);console.log({yaml:e}),this.sections=e.sections,this.setupXml(),this.activeSection=0},watch:{},computed:{isDark(){return this.$store.state.isDarkMode}},methods:{setupXml(){const e=new O({ignoreAttributes:!1,preserveOrder:!1,attributeNamePrefix:"$"});try{this.xmlConfig=e.parse(U)}catch(t){throw console.error("WHAT",t),Error(""+t)}for(const t of this.sections)for(const n of t.entries){const[r,a]=n.xml.split("."),i=this.xmlConfig.config.module.find(l=>l.$name==r);if(a=="param"){const l=i.param.find(s=>s.$name==n.name);n.value=l.$value}}},update(){for(const n of this.sections)for(const r of n.entries){const[a,i]=r.xml.split("."),l=this.xmlConfig.config.module.find(s=>s.$name==a);if(i=="param"){const s=l.param.find(u=>u.$name==r.name);s.$value=r.value}}console.log(this.xmlConfig);const t=new f({format:!0,ignoreAttributes:!1,attributeNamePrefix:"$",suppressUnpairedNode:!0,suppressEmptyNode:!0}).build(this.xmlConfig);console.log(t)},switchSection(e){this.activeSection=e}}});var X=function(){var t=this,n=t._self._c;return t._self._setupProxy,n("div",{staticClass:"configurator"},[n("div",{staticClass:"content"},[n("div",{staticClass:"section-panel"},t._l(t.sections,function(r,a){return n("div",{key:r.name,staticClass:"config-section",on:{click:function(i){return t.switchSection(a)}}},[n("p",{class:{active:t.activeSection==a}},[t._v(t._s(r.title))])])}),0),t.activeSection>-1?n("div",{staticClass:"details-panel"},[n("div",{staticClass:"buttons"},[n("b-button",[t._v("Cancel")]),n("b-button",{attrs:{type:"is-success"},on:{click:t.update}},[t._v("Save")])],1),t._l(t.sections[t.activeSection].entries,function(r){return n("div",{staticClass:"entry"},[n("p",[t._v(t._s(r.title))]),n("b-input",{attrs:{type:"text"},model:{value:r.value,callback:function(a){t.$set(r,"value",a)},expression:"item.value"}})],1)})],2):t._e()])])},K=[],Y=$(z,X,K,!1,null,"770a35e2");const Z=Y.exports;export{Z as default};
