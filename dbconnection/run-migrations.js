
const { exec } = require('child_process');

// Run migration here to avoid terminal commands
function runMigration() {
    return new Promise((resolve, reject) => {
        const migrate = exec(
            'npx sequelize-cli db:migrate',
            { env: process.env },
            (err) => (err ? reject(err) : resolve())
        );

        // Forward stdout and stderr to this process
        migrate.stdout.pipe(process.stdout);
        migrate.stderr.pipe(process.stderr);
    });
}

exports.runMigrations = async () => {
    try {
        await runMigration();
        console.log('Migration completed successfully.');
        return true
    } catch (error) {
        console.error('Migration failed:', error);
        return false
    }
}