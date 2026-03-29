# Online To-Do App

This is a **frontend-focused To-Do web application** built using **HTML, CSS, and JavaScript**.  
It allows users to manage tasks across multiple sections: Today, Important, Workouts, Groceries, and Create a List.

---

# Features

1) Today
- Add tasks that need to be completed today.
- Mark tasks as completed or delete them.
- Tasks are automatically saved in **localStorage**.
- **Tasks reset automatically the next day** to start fresh.

2) Important
- Add tasks with an optional date and time.
- Tasks are saved in localStorage and persist until manually deleted.
- Notifications for upcoming deadlines are **not implemented** in this version.

3) Workouts
- Add workout entries with a title and content.
- Edit entries directly in the interface.
- Entries persist in localStorage and are **not date-limited**.

4) Groceries
- Add and manage grocery items.
- Mark items as completed or delete them.
- Persist in localStorage.

5) Create a List
- Create custom lists and add tasks to them.
- Edit list titles and manage tasks.
- Tasks persist in localStorage.

---

## Implementation Notes

- **Data Storage:** All sections use `localStorage` to persist data in the browser.  
  - Only the **Today section** resets daily.  
  - Other sections persist indefinitely.
- **Frontend Focus:** This project emphasizes DOM manipulation, local storage management, and dynamic user interfaces.  
- **Notifications:** To implement notifications for important tasks, a backend or service worker is required. This version focuses on frontend functionality.

---

## How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/kleaadishaa/new-repo.git

   
