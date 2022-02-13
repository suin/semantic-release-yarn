/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-husky-install",
factory: function (require) {
var plugin=(()=>{var c=Object.create,e=Object.defineProperty;var n=Object.getOwnPropertyDescriptor;var t=Object.getOwnPropertyNames;var a=Object.getPrototypeOf,p=Object.prototype.hasOwnProperty;var d=s=>e(s,"__esModule",{value:!0});var h=s=>{if(typeof require!="undefined")return require(s);throw new Error('Dynamic require of "'+s+'" is not supported')};var y=(s,l)=>{for(var o in l)e(s,o,{get:l[o],enumerable:!0})},u=(s,l,o)=>{if(l&&typeof l=="object"||typeof l=="function")for(let r of t(l))!p.call(s,r)&&r!=="default"&&e(s,r,{get:()=>l[r],enumerable:!(o=n(l,r))||o.enumerable});return s},f=s=>u(d(e(s!=null?c(a(s)):{},"default",s&&s.__esModule&&"default"in s?{get:()=>s.default,enumerable:!0}:{value:s,enumerable:!0})),s);var P={};y(P,{default:()=>m});var i=f(h("child_process")),g={hooks:{async afterAllInstalled(){i.execSync("yarn husky install",{stdio:"inherit"})}}},m=g;return P;})();
return plugin;
}
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc291cmNlcy9pbmRleC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHR5cGUgeyBQbHVnaW4gfSBmcm9tIFwiQHlhcm5wa2cvY29yZVwiO1xuaW1wb3J0ICogYXMgY2hpbGRQcm9jZXNzIGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5cbmNvbnN0IHBsdWdpbjogUGx1Z2luID0ge1xuICBob29rczoge1xuICAgIGFzeW5jIGFmdGVyQWxsSW5zdGFsbGVkKCkge1xuICAgICAgY2hpbGRQcm9jZXNzLmV4ZWNTeW5jKFwieWFybiBodXNreSBpbnN0YWxsXCIsIHsgc3RkaW86IFwiaW5oZXJpdFwiIH0pO1xuICAgIH0sXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBwbHVnaW47XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7OztzdEJBQUEsOEJBQ0EsTUFBOEIsc0JBRXhCLEVBQWlCLENBQ3JCLE1BQU8sTUFDQyxvQkFBb0IsQ0FDeEIsQUFBYSxXQUFTLHFCQUFzQixDQUFFLE1BQU8sZUFLcEQsRUFBUSIsCiAgIm5hbWVzIjogW10KfQo=
