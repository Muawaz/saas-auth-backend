
const { exec } = require('child_process');

// Run migration here to avoid terminal commands
function runSeeder() {
    return new Promise((resolve, reject) => {
        const seed = exec(
            'npx sequelize-cli db:seed:all',
            { env: process.env },
            (err) => (err ? reject(err) : resolve())
        );

        // Forward stdout and stderr to this process
        seed.stdout.pipe(process.stdout);
        seed.stderr.pipe(process.stderr);
    });
}

exports.runSeeders = async () => {
    try {
        await runSeeder();
        console.log('Seeding completed successfully.');
        return true
    } catch (error) {
        console.error('Seeding failed:', error);
        return false
    }
}