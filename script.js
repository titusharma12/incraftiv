const CATEGORY = "category-";

// Function to fetch data from API
const fetchData = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was a problem fetching the data:", error);
  }
};

//Function to gget main categories data
const GetNavLinks = async () => {
  const mainCategoriesUrl = "https://ecomm.dotvik.com/v2kart/service/categories/mainCategories";

  const mainCategoriesData = await fetchData(mainCategoriesUrl);

  if (mainCategoriesData && mainCategoriesData.data) {
    GenerateMainCategoriesItems(mainCategoriesData.data);
  }
};

//Function to get sub categories data
const GetSubCategoryLinks = async (urlKey) => {
  const subCategoryUrl = `https://ecomm.dotvik.com/v2kart/service/categories/${urlKey}/tree`;

  const subCategoryData = await fetchData(subCategoryUrl);
  
  if (subCategoryData && subCategoryData.data) {
    GenerateSubCategoryItems(subCategoryData.data);
  }

  if(subCategoryData && subCategoryData.data.childCategory){
    GenerateSubChildCategoryItems(subCategoryData.data.childCategory);
  }

};

// Function to dynamically generate list items
function GenerateMainCategoriesItems(categories) {
  const navbar = document.getElementById("navbar-links");
  categories.forEach((category) => {
    const li = document.createElement("li");
    li.id = CATEGORY + category.id;
    li.classList.add("nav-item", "dropdown");
    const a = document.createElement("a");
    a.classList.add("nav-link", "dropdown-toggle", "text-dark");
    a.href = "#";
    a.setAttribute("role", "button");
    a.setAttribute("data-bs-toggle", "dropdown");
    a.setAttribute("aria-expanded", "false");
    a.textContent = category.categoryName;

    const subCategoryUrlKey = category.urlKey;

    GetSubCategoryLinks(subCategoryUrlKey);

    li.appendChild(a);
    navbar.appendChild(li);
  });
}

// Function to dynamically generate sub category list items
function GenerateSubCategoryItems(subCategory) {
    const subCategoriesList = subCategory.subCategory;

    if(subCategoriesList.length === 0) return;

    const parentCategoryId = CATEGORY + subCategory.id;

    const parentCategory = document.getElementById(parentCategoryId);
    const ul = document.createElement("ul");
    ul.classList.add('dropdown-menu','width-200');
    ul.setAttribute("aria-labelledby", "navbarDropdown");

    subCategoriesList.map((subCategoryItem)=>{
        const li = document.createElement("li");
        li.id = CATEGORY + subCategoryItem.id;
        li.classList.add('dropdown-item');
        li.setAttribute('href',"#");
        li.setAttribute("role", "button");

        const a = document.createElement("a");
        a.textContent = subCategoryItem.categoryName;
        a.classList.add("nav-link", "dropdown-toggle", "text-dark");
        a.href = "#";
        // Add click event handler to stop event propagation
        a.onclick = function(event) {
            event.stopPropagation();
            ShowChildMenu(this);
        };
        
        const icon = document.createElement("i");
        icon.classList.add("fa-solid", "fa-chevron-right","px-2");
        icon.setAttribute("aria-hidden", "true");

        a.appendChild(icon);

        li.appendChild(a);
        ul.appendChild(li);
    });
    
    parentCategory.appendChild(ul);
}


// Function to dynamically generate sub child category list items
function GenerateSubChildCategoryItems(subChildCategories) {
    if(subChildCategories.length === 0) return;

    subChildCategories.map((subChildCategory)=>{
        const parentCategoryId = CATEGORY + subChildCategory.parentId;
        const parentCategory = document.getElementById(parentCategoryId);

        const ul = document.createElement("ul");
        ul.classList.add('sub-child-menu','width-200');
        ul.setAttribute("aria-labelledby", "navbarDropdown");

        const li = document.createElement("li");
        li.id = CATEGORY + subChildCategory.id;
        li.classList.add('dropdown-item','bg-white');
        li.setAttribute("role", "button");

        const a = document.createElement("a");
        a.textContent = subChildCategory.categoryName;
        a.onclick = function(event) {
            event.stopPropagation();
        };

       
        li.appendChild(a);
        ul.appendChild(li);
        parentCategory.appendChild(ul);
    })
}

function ShowChildMenu(event){
    var subMenus = event.parentElement.querySelectorAll('.sub-child-menu');
    subMenus.forEach(function(subMenu) {
        if (subMenu.style.display === 'block') {
            subMenu.style.display = 'none';
        } else {
            subMenu.style.display = 'block';
        }
    });

    const icon = event.querySelector('.fa-chevron-right,.fa-chevron-down');

    if (icon) {
        icon.classList.toggle('fa-chevron-right');
        icon.classList.toggle('fa-chevron-down');
    }
}

function ToggleShowHideSubMenu(event){
    console.log(event);
    const subMenu = event.parentElement.querySelector('.dropdown-menu');
    subMenu.classList.toggle('show');
}


document.addEventListener("DOMContentLoaded", function () {
  GetNavLinks();
});

