export async function uploadImage(file: any, supabase: any) {
  const fileName = `${Date.now()}-${file.filename}`;
  const buffer =  await file.toBuffer();
  const { error } = await supabase.storage
    .from("products")
    .upload(fileName, buffer, {
      contentType: file.mimetype,
    });

  if (error) throw error;

  return supabase.storage.from("products").getPublicUrl(fileName).data.publicUrl;
}