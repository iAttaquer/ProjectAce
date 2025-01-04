CREATE PROCEDURE delete_project(project_id uuid)
LANGUAGE plpgsql
as $$BEGIN
  DELETE FROM assignment_users WHERE AssignmentId IN (SELECT id FROM assignments WHERE ProjectId = delete_project.project_id);
  DELETE FROM assignments WHERE ProjectId = delete_project.project_id;
  DELETE FROM project_team WHERE ProjectId = delete_project.project_id;

  DELETE FROM projects WHERE id = delete_project.project_id;

  COMMIT;
EXCEPTION WHEN OTHERS THEN
  ROLLBACK;
  RAISE;
END;$$;