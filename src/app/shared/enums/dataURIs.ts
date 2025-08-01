export enum DataURLs {
  PNG = 'data:image/png;base64,',
  JPEG = 'data:image/jpeg;base64,',
  PDF = 'data:application/pdf;base64,',
}

export const dataUrl = {
  png:DataURLs.PNG,
  jpeg:DataURLs.JPEG,
  pdf:DataURLs.PDF,
  jpg:DataURLs.JPEG,
}