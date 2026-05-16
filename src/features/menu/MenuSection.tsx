interface MenuItem {
  en: string;
  ko: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    en: 'Homemade bread from French wheat',
    ko: '프랑스 밀가루로 만든 수제 브레드',
  },
  {
    en: 'Beef Tartare & Spanish Harmon & Melon & French Traditional Ratatouille Tart',
    ko: '소고기 육회 타르타르 & 스페이산 하몽과 멜론 & 프랑스 전통 라따뚜이 타르트',
  },
  {
    en: 'Dry Cherry Tomato & Sweet Pumpkin Soup',
    ko: '썬드라이 체리 토마토를 곁들인 달콤한 단호박 스프',
  },
  {
    en: 'Rose sauce spaghetti with shrimp and red crab meat',
    ko: '새우와 홍게살이 들어간 로제 소스 스파게티',
  },
  {
    en: 'Top-of-the-line sirloin steak with pot wine sauce, grilled asparagus, dry tomato Truffle oil and potato mesh with granapadano cheese',
    ko: '포트와인소스를 곁들인 최고급 등심스테이크, 구운 아스파라거스, 드라이토마토\n트러플오일 과 그라노파다노치즈의 감자메쉬',
  },
  {
    en: 'Sweet and moist tiramisu with rich mascarpone flavor',
    ko: '달콤한 마스카포네 맛이 풍부한 촉촉한 티라미수',
  },
];

export function MenuSection() {
  return (
    <div className="max-w-md mx-auto mb-12">
      <h2 className="text-sm tracking-[0.3em] text-gray-500 dark:text-gray-400 text-center mb-8">
        MENU
      </h2>

      <div className="space-y-8 text-center">
        {MENU_ITEMS.map((item, index) => (
          <div key={index}>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 italic">
              {item.en}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
              {item.ko}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuSection;
