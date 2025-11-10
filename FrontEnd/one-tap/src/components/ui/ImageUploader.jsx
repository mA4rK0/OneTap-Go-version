import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useRef } from 'react';

export default function ImageUploader({ value, onChange }) {
  const inputRef = useRef();
  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      onChange && onChange({ file, preview: reader.result });
    reader.readAsDataURL(file);
  };
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Button variant="outlined" onClick={() => inputRef.current?.click()}>
        Upload
      </Button>
      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/*"
        onChange={onFile}
      />
      {value?.preview && (
        <img
          src={value.preview}
          alt="preview"
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            objectFit: 'cover',
          }}
        />
      )}
    </Stack>
  );
}
