-- Demonstration data — Section 23.
-- Every row here is is_demonstration = true and uses generic/public metadata.
-- No partnerships, no logos, no accreditation claims.

insert into public.institutions (name, slug, description, authorization_status, is_demonstration) values
  ('Open Learning Institute', 'open-learning-institute', 'Demonstration record representing a generic open-courseware provider.', 'public_information', true),
  ('Global Tech Academy', 'global-tech-academy', 'Demonstration record representing a generic technology-training provider.', 'public_information', true),
  ('Community Cloud College', 'community-cloud-college', 'Demonstration record representing a generic community college partner.', 'unverified', true),
  ('Aviation Sciences Forum', 'aviation-sciences-forum', 'Demonstration record for aviation-technology proposed content.', 'unverified', true),
  ('Independent Certification Council', 'independent-certification-council', 'Demonstration record representing a generic certification body.', 'public_information', true);

insert into public.categories (slug, name) values
  ('python', 'Python Programming'),
  ('webdev', 'JavaScript and Web Development'),
  ('ai', 'Artificial Intelligence'),
  ('ml', 'Machine Learning'),
  ('data-science', 'Data Science'),
  ('cybersecurity', 'Cybersecurity'),
  ('cloud', 'Cloud Computing'),
  ('business', 'Business and Entrepreneurship'),
  ('ecommerce', 'E-commerce'),
  ('robotics', 'Robotics'),
  ('aviation', 'Aviation Technology'),
  ('cert-prep', 'Professional Certification Preparation');

-- Course/pathway/FAA/CTE demo rows (Section 23: 12+ courses, 4+ pathways,
-- one FAA pathway, one CTE pathway, Oracle/Claude-ecommerce/IBM/Apple
-- cert-prep examples) are intentionally left for Milestone 2, once course
-- authoring is built — seeding realistic course metadata by hand here would
-- risk looking like fabricated provider claims rather than clearly-labeled
-- placeholders. Track this in PROGRESS.md.
