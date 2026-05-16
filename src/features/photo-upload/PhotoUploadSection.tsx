interface PhotoUploadSectionProps {
  qrImage?: string;
  uploadUrl?: string;
}

export function PhotoUploadSection({
  qrImage = '/assets/qrcode.png',
  uploadUrl = 'https://file.kiwi/52ebb6de#-G7NwPxJqYvQ4lZSo2mYpQ',
}: PhotoUploadSectionProps) {
  const openUploadLink = () => {
    window.open(uploadUrl, '_blank');
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-sm tracking-[0.3em] text-gray-500 dark:text-gray-400 text-center mb-8">
        PHOTO UPLOAD
      </h2>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
        사진 업로드
      </p>

      <div className="flex justify-center mb-6">
        <img
          src={qrImage}
          alt="사진 업로드 QR 코드"
          className="w-48 h-48 object-contain rounded-lg bg-white p-2"
        />
      </div>

      <button
        onClick={openUploadLink}
        className="w-full py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
        type="button"
      >
        바로가기
      </button>
    </div>
  );
}

export default PhotoUploadSection;
