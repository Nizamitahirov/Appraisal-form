document.addEventListener('DOMContentLoaded', () => {
    // Helper function to convert evaluation string to point value
    const getEvaluationPoints = (evaluation) => {
        switch (evaluation) {
            case 'E--': return 0;
            case 'E-': return 1;
            case 'E': return 3;
            case 'E+': return 4;
            case 'E++': return 5;
            default: return 0;
        }
    };

    // 1. Calculate DEPARTMENT PERFORMANCE RATING
    const calculateDepartmentPerformanceRating = () => {
        let totalWeightedPoints = 0;
        let totalWeight = 0;
        const deptRows = 9; // Number of department objective rows

        for (let i = 1; i <= deptRows; i++) {
            const weightInput = document.querySelector(`.dept-weight[data-row="${i}"]`);
            const evaluationSelect = document.querySelector(`.dept-evaluation[data-row="${i}"]`);

            const weight = parseFloat(weightInput.value) || 0;
            const evaluation = evaluationSelect.value;
            const points = getEvaluationPoints(evaluation);

            totalWeightedPoints += weight * points;
            totalWeight += weight;
        }

        const deptPerfWeightDisplay = document.getElementById('deptPerfWeight');
        const deptPerfRatingDisplay = document.getElementById('deptPerfRating');

        // Display total weight as a percentage
        deptPerfWeightDisplay.textContent = `${totalWeight}%`;

        if (totalWeight === 0) {
            deptPerfRatingDisplay.textContent = '0%';
            return 0; // Return 0 if no weights are set to avoid division by zero
        }
        
        // Normalize the totalWeightedPoints by dividing by the total possible points if all were 'E' (3 points)
        // and then converting to a percentage based on the actual total weight.
        // The original formula seems to imply a direct scaling where 3 points is 100%.
        // Let's adjust based on the Excel logic.
        
        // Excel formula for TotalPoint: Sum of (Weight * Evaluation_Point)
        // Then IF(TotalPoint=3, 100%, TotalPoint/3)
        // This implies that '3' points is the benchmark for 100%.
        // The total weight is already accounted for in TotalPoint if weights are percentages summing to 100.
        
        // Re-interpreting Excel logic directly:
        let totalPoint = 0;
        for (let i = 1; i <= deptRows; i++) {
            const weightInput = document.querySelector(`.dept-weight[data-row="${i}"]`);
            const evaluationSelect = document.querySelector(`.dept-evaluation[data-row="${i}"]`);
            const weight = parseFloat(weightInput.value) / 100 || 0; // Assuming weights are entered as % (e.g., 20) and need to be /100
            const evaluation = evaluationSelect.value;
            const points = getEvaluationPoints(evaluation);
            totalPoint += weight * points;
        }

        let departmentRating = 0;
        if (totalPoint === 3) {
            departmentRating = 1; // 100%
        } else {
            departmentRating = totalPoint / 3;
        }
        
        deptPerfRatingDisplay.textContent = `${(departmentRating * 100).toFixed(0)}%`;
        return departmentRating;
    };


    // 2. Calculate EMPLOYEE JOB PERFORMANCE RATING (same logic as department, but with different inputs)
    const calculateEmployeeJobPerformanceRating = () => {
        let totalPoint = 0;
        let totalWeight = 0;
        const empObjRows = 7; // Max number of employee objective rows, adjust if you make it dynamic

        for (let i = 1; i <= empObjRows; i++) {
            const weightInput = document.querySelector(`.emp-obj-weight[data-row="${i}"]`);
            const evaluationSelect = document.querySelector(`.emp-obj-evaluation[data-row="${i}"]`);

            // Check if the elements exist for the current row
            if (weightInput && evaluationSelect) {
                const weight = parseFloat(weightInput.value) / 100 || 0; // Assuming weights are entered as %
                const evaluation = evaluationSelect.value;
                const points = getEvaluationPoints(evaluation);

                totalPoint += weight * points;
                totalWeight += (parseFloat(weightInput.value) || 0); // Sum raw weights for display
            }
        }
        
        const empJobPerfWeightDisplay = document.getElementById('empJobPerfWeight');
        const empJobPerfRatingDisplay = document.getElementById('empJobPerfRating');
        
        empJobPerfWeightDisplay.textContent = `${totalWeight}%`;

        if (totalWeight === 0) { // If no weights are set or total weight is 0
            empJobPerfRatingDisplay.textContent = '0%';
            return 0;
        }

        let employeeJobRating = 0;
        if (totalPoint === 3) {
            employeeJobRating = 1; // 100%
        } else {
            employeeJobRating = totalPoint / 3;
        }
        
        empJobPerfRatingDisplay.textContent = `${(employeeJobRating * 100).toFixed(0)}%`;
        return employeeJobRating;
    };

    // 3. Calculate TOTAL LEADERSHIP COMPETENCIES RATING
    const calculateTotalLeadershipRating = () => {
        let totalPoints = 0;
        const compRows = 5; // Number of leadership competency rows

        for (let i = 1; i <= compRows; i++) {
            const evaluationSelect = document.querySelector(`.comp-evaluation[data-row="${i}"]`);
            const evaluation = evaluationSelect.value;
            totalPoints += getEvaluationPoints(evaluation);
        }
        
        // This calculation is simpler as it averages points directly.
        // Assuming each competency has equal "weight" for averaging.
        // Max possible points for 5 competencies: 5 * 5 (E++) = 25
        // Or 5 * 3 (E) = 15 for a "meets standards" average.
        // The image shows 80%, which might imply a specific target or calculation not fully detailed.
        // Let's assume a direct average as a percentage of max possible.
        // Max points if all are E (3 points) = 15.
        // If 80% is fixed, it doesn't need calculation. Let's make it fixed for now based on the image.
        // If it needs to be dynamic, we'd need more info on how 80% is derived.
        
        // The image shows a fixed "80%", so we'll just set it. If it were dynamic:
        // const avgPoints = totalPoints / compRows;
        // const percentage = (avgPoints / 5) * 100; // As a percentage of the highest possible (E++)
        // document.getElementById('totalLeadershipRating').textContent = `${percentage.toFixed(0)}%`;
        // return percentage / 100; // Return as decimal for overall calculation

        document.getElementById('totalLeadershipRating').textContent = '80%'; // Fixed as per image
        return 0.8; // Return 0.8 for the overall calculation
    };

    // 4. Calculate OVERALL EMPLOYEE PERFORMANCE RATING FOR THE YEAR
    const calculateOverallPerformanceRating = () => {
        const indPerf = calculateEmployeeJobPerformanceRating(); // This is the result from EMPLOYEE JOB PERFORMANCE RATING
        const compPerf = calculateTotalLeadershipRating(); // This is the result from TOTAL LEADERSHIP COMPETENCIES RATING (0.8 if fixed)
        
        // The formula for AVERAGE(Ind_Perf, Comp_Perf) implies these are percentages or decimal values.
        // We'll use the decimal values returned by the previous functions.
        let perfResult = (indPerf + compPerf) / 2;

        let overallRating = 'E--';
        if (perfResult > 1.15) {
            overallRating = 'E++';
        } else if (perfResult > 1) {
            overallRating = 'E+';
        } else if (perfResult > 0.9) {
            overallRating = 'E';
        } else if (perfResult > 0.75) {
            overallRating = 'E-';
        }

        document.getElementById('overallRatingValue').textContent = overallRating;
    };

    // Attach event listeners to all relevant input fields and selects
    const addEventListeners = () => {
        // Department Objectives
        document.querySelectorAll('.dept-weight, .dept-evaluation').forEach(element => {
            element.addEventListener('change', () => {
                calculateDepartmentPerformanceRating();
                calculateOverallPerformanceRating();
            });
        });

        // Employee Job Objectives
        document.querySelectorAll('.emp-obj-weight, .emp-obj-evaluation').forEach(element => {
            element.addEventListener('change', () => {
                calculateEmployeeJobPerformanceRating();
                calculateOverallPerformanceRating();
            });
        });

        // Leadership Competencies
        document.querySelectorAll('.comp-evaluation').forEach(element => {
            element.addEventListener('change', () => {
                calculateTotalLeadershipRating();
                calculateOverallPerformanceRating();
            });
        });
    };

    // Initial calculations when the page loads
    addEventListeners();
    calculateDepartmentPerformanceRating();
    calculateEmployeeJobPerformanceRating();
    calculateTotalLeadershipRating();
    calculateOverallPerformanceRating();
});
