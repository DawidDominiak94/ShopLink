export const useLogger = ( name : string ) => 
{
  const isProduction = useRuntimeConfig().public.prod;


  function info(...args: any[]) {
    if (!isProduction) {
      console.info( `${new Date().toLocaleString()}---[${name}]`, ...args);
    }
  }

  function warn(...args: any[]) {
    if (!isProduction) {
      console.warn( `${new Date().toLocaleString()}---[${name}]`, ...args);
    }
  }
  
  function error(...args: any[]) {
    if (!isProduction) {
      console.error( `${new Date().toLocaleString()}---[${name}]`, ...args);
    }
  }

  function debug(...args: any[]) {
    if (!isProduction) {
      console.debug( `${new Date().toLocaleString()}---[${name}]`, ...args);
    }
  }

  function log(...args: any[]) {
    if (!isProduction) {
      console.log( `${new Date().toLocaleString()}---[${name}]`, ...args);
    }
  }

  return { info, warn, error, debug, log }
}
