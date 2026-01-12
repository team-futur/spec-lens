export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'code' | 'link';

export const MEDIA_TYPE_MAP: Record<string, MediaType> = {
  // 이미지 파일
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  gif: 'image',
  webp: 'image',
  svg: 'image',
  bmp: 'image',
  ico: 'image',
  tiff: 'image',
  tif: 'image',
  avif: 'image',
  heic: 'image',
  heif: 'image',

  // 비디오 파일
  mp4: 'video',
  avi: 'video',
  mkv: 'video',
  mov: 'video',
  wmv: 'video',
  flv: 'video',
  webm: 'video',
  m4v: 'video',
  '3gp': 'video',
  ogv: 'video',

  // 오디오 파일
  mp3: 'audio',
  wav: 'audio',
  flac: 'audio',
  aac: 'audio',
  ogg: 'audio',
  m4a: 'audio',
  wma: 'audio',
  opus: 'audio',

  // 문서 파일
  pdf: 'document',
  doc: 'document',
  docx: 'document',
  xls: 'document',
  xlsx: 'document',
  ppt: 'document',
  pptx: 'document',
  txt: 'document',
  rtf: 'document',
  odt: 'document',

  // 압축 파일
  zip: 'archive',
  rar: 'archive',
  '7z': 'archive',
  tar: 'archive',
  gz: 'archive',
  bz2: 'archive',

  // 코드 파일
  js: 'code',
  ts: 'code',
  jsx: 'code',
  tsx: 'code',
  css: 'code',
  html: 'code',
  php: 'code',
  py: 'code',
  java: 'code',
  cpp: 'code',
  c: 'code',
  json: 'code',
  xml: 'code',
};
