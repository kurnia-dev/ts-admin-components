declare module 'check/*' {}
declare module 'base64toblob' {
  function base64ToBlob(base64: any, mime: any): Blob;
  export = base64ToBlob;
}