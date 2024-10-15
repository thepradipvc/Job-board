-- Insert dummy data into users table
INSERT INTO users (name, email, password, role)
SELECT
  'User ' || i AS name,
  'user' || i || '@example.com' AS email,
  'password' || i AS password,
  CASE
    WHEN i % 2 = 0 THEN 'student'::role
    ELSE 'company'::role
  END AS role
FROM generate_series(1, 50) i;

-- Insert dummy data into companies table
INSERT INTO companies (user_id, description, industry, website, location)
SELECT
  u.id AS user_id,
  'Description for Company ' || i AS description,
  (ARRAY['Technology', 'Finance', 'Healthcare', 'Education', 'Manufacturing'])[1 + mod(i, 5)] AS industry,
  'https://company' || i || '.com' AS website,
  (ARRAY['New York', 'San Francisco', 'London', 'Tokyo', 'Berlin'])[1 + mod(i, 5)] AS location
FROM generate_series(1, 30) i
JOIN users u ON u.role = 'company'
ORDER BY random()
LIMIT 30;

-- Insert dummy data into students table
INSERT INTO students (user_id, dob, gender, course_name, graduation_year, ssc_marks, hsc_marks, cgpa, skills, resume)
SELECT
  u.id AS user_id,
  '2000-01-01'::date + (random() * 365 * 5)::integer AS dob,
  CASE
    WHEN i % 3 = 0 THEN 'male'::gender
    WHEN i % 3 = 1 THEN 'female'::gender
    ELSE 'other'::gender
  END AS gender,
  (ARRAY['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Business Administration', 'Data Science'])[1 + mod(i, 5)] AS course_name,
  2024 + mod(i, 4) AS graduation_year,
  70 + (random() * 30)::numeric(5,2) AS ssc_marks,
  70 + (random() * 30)::numeric(5,2) AS hsc_marks,
  6 + (random() * 4)::numeric(3,2) AS cgpa,
  'Skill1, Skill2, Skill3' AS skills,
  'https://resume' || i || '.pdf' AS resume
FROM generate_series(1, 50) i
JOIN users u ON u.role = 'student'
ORDER BY random()
LIMIT 50;

-- Insert dummy data into jobs table
INSERT INTO jobs (company_id, title, description, skills_required, experience_required, salary_range_start, salary_range_end, location, job_type, posted_at, deadline)
SELECT
  c.id AS company_id,
  'Job Title ' || i AS title,
  'Description for Job ' || i AS description,
  'Skill1, Skill2, Skill3' AS skills_required,
  mod(i, 5) AS experience_required,
  50000 + (random() * 50000)::integer AS salary_range_start,
  100000 + (random() * 100000)::integer AS salary_range_end,
  (ARRAY['New York', 'San Francisco', 'London', 'Tokyo', 'Berlin'])[1 + mod(i, 5)] AS location,
  (ARRAY['Full-time', 'Part-time', 'Internship'])[1 + mod(i, 3)] AS job_type,
  NOW() - (random() * 30 || ' days')::interval AS posted_at,
  NOW() + (random() * 60 || ' days')::interval AS deadline
FROM generate_series(1, 60) i
CROSS JOIN LATERAL (SELECT id FROM companies ORDER BY random() LIMIT 1) c;

-- Insert dummy data into applications table
INSERT INTO applications (job_id, student_id, status, applied_at, updated_at, offered_salary, cover_letter)
SELECT
  j.id AS job_id,
  s.id AS student_id,
  CASE
    WHEN i % 3 = 0 THEN 'pending'
    WHEN i % 3 = 1 THEN 'accepted'
    ELSE 'rejected'
  END::status AS status,
  NOW() - (random() * 30 || ' days')::interval AS applied_at,
  NOW() - (random() * 15 || ' days')::interval AS updated_at,
  CASE WHEN mod(i, 3) = 1 THEN 50000 + (random() * 100000)::integer ELSE NULL END AS offered_salary,
  'Cover letter for application ' || i AS cover_letter
FROM generate_series(1, 130) i
CROSS JOIN LATERAL (SELECT id FROM jobs ORDER BY random() LIMIT 1) j
CROSS JOIN LATERAL (SELECT id FROM students ORDER BY random() LIMIT 1) s;