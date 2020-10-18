const count = document.querySelector('.count');
const cardContainer = document.querySelector('.main__cards');
const preloader = document.querySelector('.preloader');
const form = document.querySelector('.search_form');
const search = document.getElementById('search');
const select = document.getElementById('select');


//Date
let date = new Date().getTime()
console.log(date);

const cors = 'https://cors-anywhere.herokuapp.com/'
let BASE_URL = `${cors}https://jobs.github.com/positions.json?page=4&markdown=true`

fetch(BASE_URL)
.then(res => res.json())
.then(data => {
    console.log(data);
    //let jobs = data.slice(0, 10)
    let jobs = data

    displayItems(jobs)
    filterSelect(jobs)
    filterSearch(jobs)
    count.innerHTML = `${data.length} jobs`
})
.catch(e => console.log(e))

let displayItems = (items) => {
    let itemCard = items.map(item => {
        return `<article class="card-item">
        <img src=${item.company_logo} alt="Company Logo" class="card-logo">
        <div class="left-details">
          <div class="top"><span class="company-name">${item.company}</span></div>
          <div class="middle">${item.title}</div>
          <div class="bottom"><span class="time"> ${getDays(item.created_at)}</span><span class="type">. ${item.type} </span><span class="location">. ${item.location}</span></div>
          <div class="details">
            <button type="button" class="detail-button">Details...</button>
            <div class="detail-text"><p>${item.description}</p></div>
          </div>
        </div>
        <div class="right-details">
            <div class="company_url"><a href=${item.company_url}>${item.company_url}</a></div>
            <div class="job_url"><a target="_blank" href="#" class="job_how"> ${item.how_to_apply.split(' ')[1]}</a></div>
        </div>
      </article>`
    })
    itemCard = itemCard.join('');
    cardContainer.innerHTML = itemCard;

    toggleDetails()    
}

var toggleDetails = () => {
  const details = document.querySelectorAll('.details');    
  details.forEach(detail => {
    const detailBtn = detail.querySelector('.detail-button');
    detailBtn.addEventListener('click', () => {
        // To close others while one detail is opened
          details.forEach(item => {
            if(item !== detail) {
              item.classList.remove('show-text')
            }
          })
        //Ends here  
        detail.classList.toggle('show-text')
      })
    })
}

const filterSelect = (jobItems) => {
  select.addEventListener("change", (e) => {
    const type = e.currentTarget.value;
    const jobType = jobItems.filter((jobItem) => {
      if (jobItem.type === type) {
        return jobItem;
      }
    });
    if (type === "") {
      displayItems(jobItems);
      count.textContent = `${jobItems.length} jobs found!`;
    } else {
      displayItems(jobType);
      count.textContent = `${jobType.length} jobs found!`;
    }
  });
};

var filterSearch = (searchItems) => {
  form.addEventListener("submit", (e) => {
    const location = e.currentTarget.value.toLowerCase();
    const jobLocation = searchItems.filter((searchItem) => {
      if (searchItem.location.toLowerCase() === location) {
        return searchItem;
      }
    });
    if (location === "") {
      displayItems(searchItems);
      search.value = "";
    } else {
      displayItems(jobLocation);
      count.textContent = "";
    }
  });
};

var getDays = (postDate) => {
  const today = new Date()
  const date = new Date(postDate).getTime()
  const diff = today - date
  const oneDay = 24 * 60 * 60 * 1000;
  let days = Math.floor(diff / oneDay)
  if(days > 7) {
    const week = Math.floor(days / 7)
    return `${week}w ago`;
  }else {
    return `${days}d ago `;
  }
}

// Preloader
window.addEventListener("load", () => {
  preloader.classList.add("hide-preloader");
});