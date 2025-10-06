`timescale 1ns/1ps

module example_tb;
	integer randval;
	initial begin
		if (!$value$plusargs("randval=%d", randval)) begin
			$display("FAIL");
			$finish;
		end

		if (randval < 26)
			$display("FAIL");
		else
			$display("PASS");

		$finish;
	end
endmodule
