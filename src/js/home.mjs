import { jsonToBase64, setLocalStorage } from "./utils";
import Loader from "./loader.mjs";

const menuElements = () => {
  return `
  <section class="main_actions" style="--justify-content: flex-start">
    <a href="/randapp/my_activities/" class="btn fw btn-red"><i class="fas fa-tasks"></i> My activities</a>
    <a class="btn fw btn-orange random"><i class="fas fa-random"></i> Random activity</a>
    <a class="btn fw btn-blue feelLucky"><i class="fas fa-fan"></i> I feel lucky</a>
    <a href="/randapp/my_activities/?filter=completed" class="btn fw btn-green"><i class="fas fa-filter"></i> Completed activities</a>
    <a href="/randapp/my_activities/?filter=inProgress" class="btn fw btn-pink"><i class="fas fa-filter"></i> In Progress</a>
    <a href="/randapp/category/" class="btn fw btn-aqua"><i class="fas fa-sliders-h"></i> Choose a category</a>
  </section>
  `;
};

const exampleActivity = (activity) => {
  return `
  <section class="main-example_activity loading">
    <h2>${activity.activity}</h2>
    <div class="picture_container">
     
        <img class="img-loading" src="${activity.image.src.full}" alt="Unsplash.com - ${activity.image.alt_description}">
      
    </div>
    <p>
      <span>Accesibility: ${activity.accessibility}</span> |
      <span>Type: <a href="./category/?category=${activity.type}">${activity.type}</a></span> |
      <span>Participants: ${activity.participants}</span> |
      <span>Price: ${activity.price}</span>
    </p>
    <button class="btn fw btn-orange addActivity"><i class="fas fa-plus"></i> Add to my activities!</button>
  </section>`;
};

export default class HomeScreen {
  constructor(dataSource, container) {
    this.dataSource = dataSource;
    this.container = container;
    this.activity = [];
    this.loader = new Loader(this.container);
  }

  async init() {
    this.activity = await this.dataSource.getRandomActivity();
    this.renderActivity();
    document.querySelector(".addActivity").addEventListener("click", () => {
      this.goToActivity();
    });
  }

  async feelLucky() {
    this.activity = await this.dataSource.getRandomActivity();
    this.goToActivity();
  }

  goToActivity() {
    const activity64 = jsonToBase64(this.activity);
    setLocalStorage("activities", activity64);
    window.location.href = `/randapp/activity_details/?data=${activity64}`;
  }

  removeActivity() {
    const item = document.querySelector(".main-example_activity");
    this.container.removeChild(item);
  }

  renderMenu() {
    const menu = menuElements();
    this.container.insertAdjacentHTML("afterbegin", menu);
  }

  renderActivity() {
    this.loader.show();
    const activityForm = exampleActivity(this.activity);
    this.container.insertAdjacentHTML("beforeend", activityForm);
    const activityContainer = document.querySelector(".main-example_activity");
    const activityImage = document.querySelector(".img-loading");
    this.loader.removeOnImageLoad(activityImage, activityContainer, "loading");
  }
}
