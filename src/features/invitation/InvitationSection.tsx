interface InvitationSectionProps {
  groomName: string;
  brideName: string;
  date: string;
  time: string;
  message?: string;
  groomParents?: { father: string; mother: string };
  brideParents?: { father: string; mother: string };
}

export function InvitationSection({
  groomName,
  brideName,
  date,
  time,
  message = '서로를 향한 마음을 모아\n평생을 함께 할 약속을 합니다.\n\n귀한 걸음 하시어\n저희의 새로운 시작을\n축복해 주시면 감사하겠습니다.',
  groomParents,
  brideParents,
}: InvitationSectionProps) {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-md mx-auto text-center">
        {/* Title */}
        <h2 className="text-sm tracking-[0.3em] text-gray-500 mb-8">
          INVITATION
        </h2>

        {/* Message */}
        <p className="text-gray-700 leading-relaxed whitespace-pre-line font-light text-base mb-12">
          {message}
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-gray-300 mx-auto mb-12" />

        {/* Names and Parents */}
        <div className="space-y-4 mb-12">
          {groomParents && (
            <p className="text-sm text-gray-600">
              <span className="text-gray-500">{groomParents.father} · {groomParents.mother}</span>
              <span className="text-gray-400 mx-2">의 아들</span>
              <span className="font-medium text-gray-800">{groomName}</span>
            </p>
          )}
          {brideParents && (
            <p className="text-sm text-gray-600">
              <span className="text-gray-500">{brideParents.father} · {brideParents.mother}</span>
              <span className="text-gray-400 mx-2">의 딸</span>
              <span className="font-medium text-gray-800">{brideName}</span>
            </p>
          )}
          {!groomParents && !brideParents && (
            <p className="text-xl font-serif text-gray-800">
              {groomName} <span className="text-gray-400 mx-2">&</span> {brideName}
            </p>
          )}
        </div>

        {/* Date and Time */}
        <div className="space-y-2">
          <p className="text-lg text-gray-800 font-light">{date}</p>
          <p className="text-gray-600">{time}</p>
        </div>
      </div>
    </section>
  );
}

export default InvitationSection;
