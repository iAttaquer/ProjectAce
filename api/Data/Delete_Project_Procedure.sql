CREATE PROCEDURE delete_project(project_id uuid)
LANGUAGE plpgsql
as $$BEGIN
    DELETE FROM assignment_users 
    WHERE "assignment_users"."AssignmentId" IN (
        SELECT "assignments"."Id" FROM assignments 
		WHERE "assignments"."ProjectId" = project_id
    );

    DELETE FROM assignments 
    WHERE "assignments"."ProjectId" = project_id;

    DELETE FROM project_teams
    WHERE "project_teams"."ProjectId" = project_id;

    DELETE FROM projects 
    WHERE "projects"."Id" = project_id;
END;D;$$;