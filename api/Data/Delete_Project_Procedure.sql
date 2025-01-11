CREATE PROCEDURE delete_project(project_id uuid)
LANGUAGE plpgsql
as $$
DECLARE
	to_delete_project TEXT;
	deletion_successful BOOLEAN := FALSE;
BEGIN

	SELECT "Id"
	INTO to_delete_project
	FROM projects
	WHERE "Id" = project_id AND "CreatedById" = user_id;

	IF NOT FOUND THEN
		RAISE NOTICE 'Projekt o ID % nie istnieje.', project_id;
		RETURN deletion_successful;
	END IF;

	DELETE FROM assignment_users
    WHERE "AssignmentId" IN (
        SELECT "Id" FROM assignments
		WHERE "ProjectId" = project_id
    );

    DELETE FROM assignments
    WHERE "ProjectId" = project_id;

    DELETE FROM project_teams
    WHERE "ProjectId" = project_id;

    DELETE FROM projects
    WHERE "Id" = project_id;

	deletion_successful := TRUE;
	RETURN deletion_successful;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Wystąpił błąd podczas usuwania projektu o ID %: %', project_id, SQLERRM;
        RETURN deletion_successful;
END;;D;$$;
