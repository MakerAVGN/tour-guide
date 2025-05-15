<template>
  <section class="popular-cities">
    <h2 class="popular-cities__title">Посетите популярные места</h2>
    <p class="popular-cities__desc">
      Мы предоставляем туры по популярным городам и их достопримечательностям. Насладитесь
      красочными, историческими и значимыми местами городов Крыма.
    </p>
    <div class="popular-cities__tabs">
      <button
        v-for="city in cities"
        :key="city.name"
        :class="['popular-cities__tab', { active: city.name === activeCity.name }]"
        @click="selectCity(city)"
      >
        {{ city.name }}
      </button>
    </div>
    <div class="popular-cities__image-wrap">
      <img :src="activeCity.image" :alt="activeCity.name" class="popular-cities__image" />
      <div class="popular-cities__info">
        <div class="popular-cities__leftside">
          <h3 class="popular-cities__city">{{ activeCity.name }}</h3>
          <p class="popular-cities__city-desc">{{ activeCity.description }}</p>
        </div>

        <div class="popular-cities__features">
          <div
            v-for="feature in features"
            :key="feature.text"
            class="feature-card"
            :style="{ borderColor: feature.color }"
          >
            <span class="feature-card__icon" :style="{ color: feature.color }">{{
              feature.icon
            }}</span>
            <span class="feature-card__text" :style="{ color: feature.color }">{{
              feature.text
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const cities = [
  {
    name: 'Симферополь',
    image: 'https://grandtrain.ru/upload/iblock/c2b/kmax0l4g5cp8osqhj42kqutonslj1iem.jpg',
    description:
      'Симферополь — административный центр Крыма, крупный транспортный узел и культурный центр полуострова.',
  },
  {
    name: 'Севастополь',
    image:
      'https://zastavki.gas-kvas.com/uploads/posts/2024-09/zastavki-gas-kvas-com-2uqd-p-zastavki-na-rabochii-stol-sevastopol-4.jpg',
    description:
      'Севастополь — город-герой, морской порт и база Черноморского флота, знаменитый своими бухтами и памятниками.',
  },
  {
    name: 'Алушта',
    image:
      'https://cdnn21.img.ria.ru/images/155982/77/1559827747_0:146:3124:1903_1920x1080_80_0_0_f58e43d24a99f808027deec0b48ec88e.jpg',
    description:
      'Алушта — популярный курорт на Южном берегу Крыма, известный своим мягким климатом и набережной.',
  },
  {
    name: 'Ялта',
    image: 'https://bristol-yalta.ru/upload/iblock/cbf/okqbqq0u9iv0p9dsq7kvf336pdnqb7rc.jpg',
    description:
      'Ялта — жемчужина Крыма, знаменитый курорт с красивой набережной, дворцами и горами.',
  },
  {
    name: 'Бахчисарай',
    image: 'https://turistas.me/uploads/touristic_materials/big_webp/zBaK5F1c6qPSggQOcXsh.webp',
    description:
      'Бахчисарай — древняя столица Крымского ханства, известен Ханским дворцом и пещерными городами.',
  },
  {
    name: 'Керчь',
    image:
      'https://extraguide.ru/images/blog/2022/01-25-s6ciy2-gora-mitridat-i-memorial-voinskoy-slavy.jpg',
    description:
      'Керчь — город с богатой историей, порт на востоке Крыма, знаменитый древними памятниками.',
  },
  {
    name: 'Феодосия',
    image:
      'https://cdnn1.img.crimea.ria.ru/img/111813/07/1118130752_0:0:1648:927_1920x0_80_0_0_e600074e7295e11111a5ef6c3d753d04.jpg',
    description:
      'Феодосия — курортный город на юго-востоке Крыма, известен пляжами и картинной галереей Айвазовского.',
  },
  {
    name: 'Евпатория',
    image: 'https://po-krymu.ru/wp-content/uploads/2020/10/gerakl-otdyhaet.jpg',
    description:
      'Евпатория — популярный семейный курорт на западном побережье Крыма, славится пляжами и санаториями.',
  },
]

const features = [
  {
    icon: '🚍', // Можно заменить на SVG
    text: 'Общественный транспорт',
    color: '#b97ffb',
  },
  {
    icon: '🌿',
    text: 'Природа',
    color: '#6cc3b5',
  },
  {
    icon: '🚕',
    text: 'Частный транспорт',
    color: '#ffd600',
  },
  {
    icon: '💼',
    text: 'Бизнес-туры',
    color: '#ff5b5b',
  },
  {
    icon: '📍',
    text: 'Местные достопримечательности',
    color: '#4a90e2',
  },
]

const activeCity = ref(cities[0]) // Alaska по умолчанию

function selectCity(city) {
  activeCity.value = city
}
</script>
